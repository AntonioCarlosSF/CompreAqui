const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, "O nome é obrigatório."], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, "O e-mail é obrigatório."], 
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "E-mail inválido."]
    },
    senha: { 
        type: String, 
        required: [true, "A senha é obrigatória."], 
        minlength: [6, "A senha deve ter pelo menos 6 caracteres."]
    },
    tipoUsuario: { 
        type: String, 
        enum: ["usuario", "admin"],  // Exemplo de tipos de usuários
        default: "usuario" 
    },
    dataCriacao: { 
        type: Date, 
        default: Date.now 
    },
});

// Middleware para criptografar a senha antes de salvar
UsuarioSchema.pre("save", async function (next) {
    if (!this.isModified("senha")) return next(); // Evita criptografia se a senha não foi alterada

    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar a senha digitada com a armazenada
UsuarioSchema.methods.compararSenha = async function (senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

// Exporta o modelo de usuário
const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);

module.exports = UsuarioModel;