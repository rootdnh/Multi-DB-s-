const {config} = require('dotenv');
const {join} = require('path');
const {ok} = require("assert")
const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev", "a env é invalida, ou prod ou dev");
const configPath = join(__dirname, '../config', `.env.${env}`);
config({
  path: configPath
})
const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongodb");
const HeroiSchema = require("./db/strategies/mongodb/schemas/herois.schema");
const HeroRoute = require("./routes/heroRoutes");
const AuthRoutes = require("./routes/authRoutes");
const Joi = require("joi");
const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const HapiJwt = require("hapi-auth-jwt2");
const MINHA_CHAVE_SERETA = process.env.JWT_KEY;
const Postgres = require("./db/strategies/postgres/postgres");
const UserSchema = require("./db/strategies/postgres/schemas/userSchema");
const app = new Hapi.Server({
 port: process.env.PORT,
});

function mapRoutes(instance, methods) {
 return methods.map((method) => instance[method]());
}
async function main() {
 const cennection = MongoDb.connect();
 const context = new Context(new MongoDb(cennection, HeroiSchema));
 const connectionPostgres = await Postgres.connect();
 const model = await Postgres.defineModel(connectionPostgres, UserSchema);
 const contextPostgres = new Context(new Postgres(connectionPostgres, model));


 const swaggerOptions = {
  info: {
   title: "API - HEROIS",
   version: "v1.0",
  },
 };
 await app.register([
  HapiJwt,
  Vision,
  Inert,
  {
   plugin: HapiSwagger,
   options: swaggerOptions,
  },
 ]);
 app.auth.strategy("jwt", "jwt", {
  key: MINHA_CHAVE_SERETA,
  // options: {
  //   wxpiresIn: 20
  // },
  validate: async (dado, request) => {
    const [result] = await contextPostgres.read({
      username: dado.username.toLowerCase()
    })
    if(!result){
      return {
        isValid: false,
       };
    }
   //veridicar no bando se usuário continua ativo || pagando
   return {
    isValid: true,
   };
  },
 });
 app.auth.default("jwt");
 app.validator(Joi);

 app.route([
  ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
  ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SERETA, contextPostgres), AuthRoutes.methods()),
 ]);

 await app.start();
 console.log("Servidor rodando na porta", app.info.port);
 return app;
}

module.exports = main();
