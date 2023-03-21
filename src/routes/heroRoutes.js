const BaseRoutes = require("./base/baseRoute");
const Joi = require("joi");
const failAction = (request, headers, erro) => {
 throw erro;
};
const Boom = require("boom");

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
    tags: ["api"],
    description: "Deve listar herois",
    notes: "pode paginar resultados e filtrar por nome",
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
     return Boom.internal();
    }
   },
  };
 }

 create() {
  return {
   path: "/herois",
   method: "POST",
   config: {
    tags: ["api"],
    description: "Deve cadastrar herois",
    notes: "Deve cadastrar heroi por nome e poder",
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
     return Boom.internal();
    }
   },
  };
 }

 update(id) {
  return {
   path: "/herois/{id}",
   method: "PATCH",
   config: {
    tags: ["api"],
    description: "Deve atualizar heroi por id ",
    notes: "Pode atualizar qualquer campo",
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
     const { id } = request.params;
     const { payload } = request;
     //stringify e depois parsear para remover chaves undefined
     const dadosString = JSON.stringify(payload);
     const dados = JSON.parse(dadosString);
     const result = await this.db.update(id, dados);
     if (result.modifiedCount !== 1)
      return Boom.preconditionFailed("Não econtrado no banco");
     return {
      message: "Heroi atualizado com sucesso!",
     };
    } catch (error) {
     console.error("DEu ruim", error);
     return "Erro interno";
    }
   },
  };
 }

 delete(id) {
  return {
   path: "/herois/{id}",
   method: "DELETE",
   config: {
    tags: ["api"],
    description: "Deve remover um heroi por id ",
    notes: "O id tem que ser válido",
    validate: {
     failAction,
     params: {
      id: Joi.string().required(),
     },
    },
   },
   handler: async (request) => {
    try {
     const { id } = request.params;

     const result = await this.db.delete(id);
     console.log(result);
     if (result.deletedCount !== 1)
      return Boom.preconditionFailed("Não econtrado no banco");
     return {
      message: "Heroi removido com sucesso!",
     };
    } catch (error) {
     console.error("Deu ruim", error);
     return Boom.internal();
    }
   },
  };
 }
 //end class
}

module.exports = HeroRoutes;
