const BaseRoutes = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const failAction = (request, headers, erro) => {
 throw erro;
};
const USER = {
  username: 'xuxadasilva',
  password: '123'
}
const PasswordHelper = require('./../helpers/passwordHelpers')
const Jwt = require('jsonwebtoken');

class AuthRoutes extends BaseRoutes {
  constructor(secret, db){
    super();
    this.secret = secret;
    this.db = db;
  }
 login() {
  return {
   path: "/login",
   method: "POST",
   config: {
    auth: false,
    tags: ["api"],
    description: "Obter Token",
    notes: "Faz login com user e senha do banco",
    validate: {
      failAction,
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
      }
    },
    handler: async (request) =>{
      const {username, password} = request.payload;

      const [user] = await this.db.read({
        username: username.toLowerCase()
      });

      if(!user) return Boom.unauthorized('Usuário infromado não existe!');
      const math = await PasswordHelper.comparePassword(password, user.password);
      if(!math){
        return Boom.unauthorized('Usuário ou senha inválidos')
      }      // if(username.toLowerCase() !== USER.username || password !== USER.password){
      //   return Boom.unauthorized();
      // }

      const token = Jwt.sign({
        username: username,
        id: user.id
      }, this.secret)

      return { token }
    }
   },
  };
 }
}

module.exports = AuthRoutes;