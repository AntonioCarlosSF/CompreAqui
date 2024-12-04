require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const UserRoutes = require("../routes/UserRoute");



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


// Rota para criar um novo usuário
UserRoutes.post('/Users', async (req, res) => {
  const { nome, email, senha, tipoUsuario, cpf, anoNascimento } = req.body;

  // Validações básicas
  if (!nome || !email || !senha || !cpf || !anoNascimento) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
      // Cria um novo usuário usando o modelo
      const newUser = new UserModel({
          nome,
          email,
          senha,
          tipoUsuario: tipoUsuario || 'usuario', // Define "usuario" como padrão, se não for informado
          cpf,
          anoNascimento
      });

      // Salva o usuário no banco de dados
      const savedUser = await newUser.save();
      res.status(201).json({ 
          message: 'Usuário cadastrado com sucesso!', 
          user: {
              id: savedUser._id,
              nome: savedUser.nome,
              email: savedUser.email,
              tipoUsuario: savedUser.tipoUsuario,
              cpf: savedUser.cpf,
              anoNascimento: savedUser.anoNascimento,
              dataCriacao: savedUser.dataCriacao
          }
      });
  } catch (error) {
      if (error.code === 11000) {
          // Trata erro de duplicidade (e-mail ou CPF)
          return res.status(400).json({ message: 'E-mail ou CPF já cadastrado!' });
      }
      console.error('Erro ao salvar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});


// rota
app.use(UserRoutes);

let port = 3000; 
app.listen(port, () => {
  console.log("Servidor rodando na porta: " + port);
});