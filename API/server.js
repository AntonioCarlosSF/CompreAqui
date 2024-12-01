require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const UserRoutes = require("../routes/UserRoutes");



// Conexão com o banco de dados:
mongoose.connect(process.env.CONNECTSTRING).then(() => {
  console.log("Conexão com o banco de dados realizada com sucesso!");
});

app.use(cors());

// Permitir que o front-end acesse o back-end (Ajuste o origin conforme sua necessidade)
//app.use(cors({
  //origin: "http://localhost:3000", // URL do seu frontend
  //methods: "GET,POST", // Métodos permitidos
  //allowedHeaders: "Content-Type", // Cabeçalhos permitidos
  //credentials: true, // Permite o envio de cookies
//}));
app.use(express.json()); // Middleware para o express entender JSON
app.use(express.urlencoded({ extended: true })); // Middleware para o express entender formulários

const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()', // Chave secreta para a sessão
    store: MongoStore.create({ mongoUrl: process.env.CONNECTSTRING }), // Armazenamento da sessão no banco de dados
    resave: false, // Evita que a sessão seja salva a cada requisição
    saveUninitialized: false, // Evita que uma sessão vazia seja salva
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    } // Tempo de vida do cookie
  });
  app.use(sessionOptions);

  // desativado temporariamente
  //app.use(csrf()); // Middleware para proteção CSRF
  //app.use(checkCsrfError); // Middleware para checar erros de CSRF
  //app.use(csrfMiddleware); // Middleware para proteção CSRF

// rotas
app.get("/", (req, res) => {
    res.json("Olá do back");
});

app.post('/Users', (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }
  // Simula um sucesso no cadastro
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// rota
app.use(UserRoutes);

let port = 3000; 
app.listen(port, () => {
  console.log("Servidor rodando na porta: " + port);
});