const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongodb");
const HeroiSchema = require("./db/strategies/mongodb/schemas/herois.schema");
const HeroRoute = require("./routes/heroRoutes");
const Joi = require("joi");
const HapiSwagger= require('hapi-swagger');
const Vision= require('@hapi/vision');
const Inert= require('@hapi/inert');

const app = new Hapi.Server({
 port: 5001,
});

function mapRoutes(instance, methods) {
 return methods.map((method) => instance[method]());
}
async function main() {
 const cennection = MongoDb.connect();
 const context = new Context(new MongoDb(cennection, HeroiSchema));
 const swaggerOptions = {
  info: {
    title: 'API - HEROIS',
    version: 'v1.0'
  }
 }
 await app.register([
  Vision,
  Inert,
  {
    plugin: HapiSwagger,
   options: swaggerOptions

  }
 ]);
 app.validator(Joi);
 app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));

 await app.start();
 console.log("Servidor rodando na porta", app.info.port);
 return app;
}

module.exports = main();
