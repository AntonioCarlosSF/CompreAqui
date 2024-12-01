const mongoose = require("../API/node_modules/mongoose");
const validator = require("../API/node_modules/validator");
const bycrypt = require("../API/node_modules/bcryptjs");

// cria um schema
const LoginSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    // verifica primeiramente se existem erro
    this.valida()
    if (this.errors.length > 0) return;

    // verifica se o usuário existe
    this.user = await LoginModel.findOne({email: this.body.email});
    if(!this.user){
        this.errors.push("O usuário não existe")
        return;
    }

    // verifica se a senha é válida
    if(!bycrypt.compareSync(this.body.password, this.user.password)){
        this.errors.push("Senha incorreta")
        this.user = null;
        return
    }
  }

  async register() {
    this.valida();

    if (this.errors.length > 0) return;

    await this.usersExist();

    if (this.errors.length > 0) return;

    try {
      const salt = bycrypt.genSaltSync();
      this.body.password = bycrypt.hashSync(this.body.password, salt);
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.log(e);
    }
  }

  valida() {
    this.cleanUp();
    // verificação de dados
    if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");

    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push("A senha precisa ter entre 3 e 50 caracteres.");
    }
  }

  async usersExist() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("O usuário já existe");
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      password: this.body.password,
    };
  }
}
module.exports = Login;