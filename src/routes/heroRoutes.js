const BaseRoutes = require("./base/baseRoute");
const Joi = require("joi");
const failAction = (request, headers, erro) => {
 throw erro;
};
class HeroRoutes extends BaseRoutes {
 constructor(db) {
  super();
  this.db = db;
 }

 list() {
  return {
   path: "/herois",
   method: "GET",
   config: {
    validate: {
     failAction,
     query: Joi.object({
      skip: Joi.number().integer().default(0),
      limit: Joi.number().integer().default(10),
      nome: Joi.string().min(3).max(100),
     }),
    },
   },
   handler: (request, headers) => {
    try {
     const { skip, limit, nome } = request.query;

     let query = {
      nome: {
       $regex: `.*${nome}*.`,
      },
     };

     return this.db.read(nome ? query : {}, skip, limit);
    } catch (error) {
     console.log("Deu ruim: ", error);
     return "Erro inteiro no servidor";
    }
   },
  };
 }

 create() {
  return {
   path: "/herois",
   method: "POST",
   config: {
    validate: {
     failAction,
     payload: {
      nome: Joi.string().required().min(3).max(1000),
      poder: Joi.string().required().min(2).max(100),
     },
    },
   },
   handler: async (request) => {
    try {
     const { nome, poder } = request.payload;
     const result = await this.db.create({ nome, poder });
     console.log("result", result);
     return {
      message: "Heroi cadastrado com sucesso!",
      _id: result._id,
     };
    } catch (error) {
     console.log("Error: ", error);
     return "Internal Error";
    }
   },
  };
 }

 update(id) {
  return {
   path: "/herois/{id}",
   method: "PATCH",
   config: {
    validate: {
     params: {
      id: Joi.string().required(),
     },
     payload: {
      nome: Joi.string().min(3).max(100),
      poder: Joi.string().min(2).max(100),
     },
    },
   },
   handler: async (request) => {
    try {
      const {id} = request.params;
      const {payload} = request;
      //stringify e depois parsear para remover chaves undefined
      const dadosString = JSON.stringify(payload)
      const dados = JSON.parse(dadosString)
      const result = await this.db.update(id, dados);
      if(result.modifiedCount !== 1) return {
        message: 'Não foi possível atualizar'
      }
      return {
        message: "Heroi atualizado com sucesso!"
      }
    } catch (error) {
     console.error("DEu ruim", error);
     return "Erro interno";
    }
   },
  };
 }
}

module.exports = HeroRoutes;
