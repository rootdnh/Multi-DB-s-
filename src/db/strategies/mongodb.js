const ICrud = require("./../strategies/insterfaces/interfaceCrud");
const Mongoose = require("mongoose");
const STATUS = {
 0: "Desconectado",
 1: "Conectado",
 2: "Conectando",
 3: "Desconectando",
};
class MongoDB extends ICrud {
 constructor() {
  super();
  this._herois = null;
  this._driver = null;
 }
 defineModel() {
  const heroiSchema = new Mongoose.Schema({
   nome: {
    type: String,
    required: true,
   },
   poder: {
    type: String,
    required: true,
   },
   insertedAt: {
    type: Date,
    default: new Date(),
   },
  });

  this._herois = Mongoose.model("herois", heroiSchema);
 }

 async isConnected() {
  const state = STATUS[this._driver.readyState];
  if (state === "Conectado") return state;
  if (state !== "Conectando") return state;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return STATUS[this._driver.readyState];
 }

 connect() {
  Mongoose.connect(
   "mongodb://rootmongo:minhasenhasecreta@localhost:27017/herois",
   { useNewUrlParser: true }
  ).catch((error) => console.log("Erro na conexão", error));

  const connection = Mongoose.connection;
  connection.once("open", () => console.log("database is running!"));

  this._driver = connection;
  this.defineModel();
 }

 create(item) {
  return this._herois.create(item);
 }

 read(query, skip = 0, limit = 10) {
  return this._herois.find(query).skip(skip).limit(limit);
 }

 update(id, item) {
  return this._herois.updateOne({_id: id}, {$set: item});
  //quando resultado não vai ser manipulado não precisa async await
 }

 delete(id){
  return this._herois.deleteOne({_id : id});
 }
}
module.exports = MongoDB;
