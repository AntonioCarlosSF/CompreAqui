const express = require("express");
const router = express.Router();
const Usuario = require("./models/UserModel"); // Importa o modelo
const UserController = require('./controllers/UserController');


router.post("/Users", UserController.register);
router.post("/Login", UserController.login)

module.exports = router;
