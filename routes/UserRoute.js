const express = require("../API/node_modules/express");
const router = express.Router();
const Usuario = require("../API/models/UserModel"); // Importa o modelo
const UserController = require('../API/controllers/UserController');

// Rota POST para criar um usuário
// router.post("/Users", async (req, res) => {
//     try {
//         const usuario = new Usuario(req.body); // Cria o usuário com os dados do corpo da requisição
//         const usuarioSalvo = await usuario.save(); // Salva no MongoDB
//         res.status(201).json({
//             mensagem: "Usuário criado com sucesso.",
//             dados: usuarioSalvo
//         });
//     } catch (erro) {
//         res.status(400).json({
//             mensagem: "Erro ao criar o usuário.",
//             erro: erro.message
//         });
//     }
// });

router.post("/Users", UserController.register);

module.exports = router;
