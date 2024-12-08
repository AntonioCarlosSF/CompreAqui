const express = require('express');
const router = express.Router();
const User = require('../models/UserModel') // Importa o modelo do usuário

// Função para validar CPF

exports.register = async (req, res) => {
    try {
        // Cria um novo usuário
        const user = new User(req.body);
        await user.register();

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        if (error.code === 11000) {
            // Verifica duplicidade (e-mail ou CPF)
            return res.status(400).json({ message: 'Ususario registrado' });
        }
        console.error('Erro ao salvar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     // Verifica se o e-mail foi fornecido
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
//     }
//     // Busca o usuário no "banco de dados"
//     const user = users.find((u) => u.email === email);
//     if (!user) {
//         return res.status(404).json({ message: 'Usuário não encontrado.' });
//     }
//     // Compara a senha fornecida com a armazenada
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Credenciais inválidas.' });
//     }
//     // Gera um token JWT para o usuário
//     const token = jwt.sign({ id: user.id, email: user.email }, {
//       expiresIn: '1h', // Token válido por 1 hora
//     });
//     res.status(200).json({
//         message: 'Login bem-sucedido!',
//         token,
//     });
//     };


exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Verifica se o e-mail e senha foram fornecidos
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário no banco de dados
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Compara a senha fornecida com a armazenada no banco de dados
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token,
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Rota para cadastrar usuário
router.post('/users', async (req, res) => { });
//Rota para login do usuário
router.post('/login',async (req,res) => {} );

