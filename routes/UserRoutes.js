const express = require("express");
const router = express.Router();
const Usuario = require("../models/UserModels"); // Importa o modelo

// Rota POST para criar um usuário
router.post("/usuarios", async (req, res) => {
    try {
        const usuario = new Usuario(req.body); // Cria o usuário com os dados do corpo da requisição
        const usuarioSalvo = await usuario.save(); // Salva no MongoDB
        res.status(201).json({
            mensagem: "Usuário criado com sucesso.",
            dados: usuarioSalvo
        });
    } catch (erro) {
        res.status(400).json({
            mensagem: "Erro ao criar o usuário.",
            erro: erro.message
        });
    }
});

module.exports = router;
