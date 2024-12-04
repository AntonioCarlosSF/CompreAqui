const express = require('../API/node_modules/express');
const router = express.Router();
const User = require('../models/UserModel'); // Importa o modelo do usuário

// Função para validar CPF
const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; // Verifica se todos os números são iguais

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
};

// Rota para cadastrar usuário
router.post('/Users', async (req, res) => {
    const { nome, email, senha, cpf, anoNascimento } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !cpf || !anoNascimento) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (!validarCPF(cpf)) {
        return res.status(400).json({ message: 'CPF inválido.' });
    }

    const currentYear = new Date().getFullYear();
    if (anoNascimento < 1900 || anoNascimento > currentYear) {
        return res.status(400).json({ message: 'Ano de nascimento inválido.' });
    }

    try {
        // Cria um novo usuário
        const newUser = new User({ nome, email, senha, cpf, anoNascimento });
        await newUser.save(); // Salva no MongoDB

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
    } catch (error) {
        if (error.code === 11000) {
            // Verifica duplicidade (e-mail ou CPF)
            return res.status(400).json({ message: 'E-mail ou CPF já cadastrado.' });
        }
        console.error('Erro ao salvar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para listar todos os usuários
router.get('/Users', async (req, res) => {
    try {
        const users = await User.find(); // Busca todos os usuários no MongoDB
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;
