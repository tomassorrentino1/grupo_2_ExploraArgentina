const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");
const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { validationResult } = require("express-validator");
const { profile } = require("console");

const db = require("../database/models");
const sequelize = db.sequelize;

const User = db.Usuario;

let usersController = {
  login: function (req, res, next) {
    res.render("login");
  },

  list: async (req, res) => {
    User.findAll().then((usuario) => {
      res.render("users", { usuario });
    });
  },

  loginStore: async (req, res) => {
    // Buscar en users.json
    // Un usuario cuyo mail sea igual al req.body.email

    const userToLogin = await User.findOne({where: {email: req.body.email}});
    if (!userToLogin) {
      return res.send("este usuario no existe");
    }

    // Comparar la contraseña del usuario de la base con la enviada en la petición
    console.log(userToLogin)
    const comparacion = bcrypt.compareSync(
      req.body.password,
      userToLogin.password
    );
      console.log(comparacion, req.body.password, userToLogin.password);
    if (comparacion) {
      req.session.user = userToLogin;
      req.session.userLogged = userToLogin;
      res.render("profile");
      //return res.redirect('/', 301)
    } else res.send("contraseña incorrecta");
  },

  register: function (req, res, next) {
    res.render("register");

  },
  

  registerStore: async function (req, res) {
    
   let errors = validationResult (req);
    if (errors.isEmpty()) {
      try { 
        const usuarioCreado = await User.create(req.body);
        usuarioCreado.password = bcrypt.hashSync(req.body.password, saltRounds);
        await usuarioCreado.save();
        return res.send(usuarioCreado);
      } catch (error) {
        console.log(error);
        return res.send("Hubo un error");
      }; 
      
    } else {
      res.render ('register', {
      old: req.body})
      
    }
      
  },

  profile: function (req, res, next) {
    res.render("profile");
    console.log(req.session);
  },
};

module.exports = usersController;
