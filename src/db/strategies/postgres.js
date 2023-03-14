const ICrud = require('./../strategies/insterfaces/interfaceCrud');

class Postgres extends ICrud {
  constructor(){
    super();
  }
  create(item){
    console.log('o item foi salvo em postgres')
  }
}

module.exports = Postgres;