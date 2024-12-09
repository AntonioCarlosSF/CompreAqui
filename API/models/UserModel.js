const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Definição do esquema do usuário
const UserSchema = new mongoose.Schema({
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
        enum: ["usuario", "admin"],  // Tipos de usuários permitidos
        default: "usuario" 
    },
    cpf: {
        type: String,
        required: [true, "O CPF é obrigatório."],
        unique: true,
        // validate: {
        //     validator: function (cpf) {
        //         return /^[0-9]{11}$/.test(cpf); // Valida formato numérico de 11 dígitos
        //     },
        //     message: "CPF inválido."
        // }
    },
    anoNascimento: {
        type: Number,
        required: [true, "O ano de nascimento é obrigatório."],
        validate: {
            validator: function (ano) {
                const currentYear = new Date().getFullYear();
                return ano >= 1900 && ano <= currentYear;
            },
            message: "Ano de nascimento inválido."
        }
    },
    dataCriacao: { 
        type: Date, 
        default: Date.now 
    },
});

// Exporta o modelo de usuário
const UserModel = mongoose.model("User", UserSchema);

function User(body){
    this.body = body;
    this.user = null;
}

User.prototype.register = async function(){
    try{
        const salt = bcrypt.genSaltSync();
        this.body.senha = bcrypt.hashSync(this.body.senha, salt)
        this.user = await UserModel.create(this.body);
    }catch(error){
        console.log('Erro ao criar o usuário', error);
    }
}

User.prototype.login = async function(){
     // Busca o usuário no banco de dados
            try{
                 this.user = await UserModel.findOne({email : this.body.email});
                const isPasswordValid = await bcrypt.compareSync(this.body.senha, this.user.senha);
                return;
            }catch(err){
                console.log("deu errado mané", err.message)
            }

     // Compara a senha fornecida com a armazenada no banco de dados
     

}




// // Middleware para criptografar a senha antes de salvar
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("senha")) return next(); // Evita criptografia se a senha não foi alterada

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.senha = await bcrypt.hash(this.senha, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });


// Método para comparar a senha digitada com a armazenada
UserSchema.methods.compararSenha = async function (senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};


module.exports = User;
