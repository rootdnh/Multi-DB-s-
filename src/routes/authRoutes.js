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
const Jwt = require('jsonwebtoken');

class AuthRoutes extends BaseRoutes {
  constructor(secret){
    super();
    this.secret = secret;
  }
 login() {
  return {
   path: "/login",
   method: "POST",
   config: {
    auth: false,
    tags: ["api"],
    description: "Obter Token",
    notes: "Faz login com usaer e senha do banco",
    validate: {
      failAction,
      payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
      }
    },
    handler: async (request) =>{
      const {username, password} = request.payload;

      if(username.toLowerCase() !== USER.username || password !== USER.password){
        return Boom.unauthorized();
      }

      const token = Jwt.sign({
        username: username,
        id: 1
      }, this.secret)

      return { token }
    }
   },
  };
 }
}

module.exports = AuthRoutes;