const ICrud = require('./../strategies/insterfaces/interfaceCrud');


class MongoDB extends ICrud {
  constructor(){
    super();
  }

  create(item){
    console.log('o item foi salvo no mongodb')
  }

}
module.exports = MongoDB;