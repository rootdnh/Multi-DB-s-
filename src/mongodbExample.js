const Mongoose = require('mongoose');


Mongoose.connect('mongodb://rootmongo:minhasenhasecreta@localhost:27017/herois',  { useNewUrlParser: true})
  .catch(error => console.log('Erro na conexão', error));

const connection = Mongoose.connection;
connection.once('open', () => console.log('database is running!'));

// setTimeout(()=>{
//   const state = connection.readyState;
//   console.log('STATE IS => ', state);
// }, 1000);

// state 0:  Desconectado
// state 1:  Conectado
// state 2:  Conectando
// state 3:  Desconectando

const heroiSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  poder: {
    type: String,
    required: true
  },
  insertedAt: {
    type: Date,
    default: new Date()
  }
})

const model = Mongoose.model('herois', heroiSchema);




async function main(){
  const resulCadastrar = await model.create({
    nome: 'Batman gaucho',
    poder: 'Costela'
  })
  console.log(resulCadastrar)
  const listarItens = await model.find()
    console.log(listarItens)
}



main();