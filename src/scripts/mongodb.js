const { DESCRIBE } = require("sequelize/types/query-types")

dokcer ps
sudo docker exec -t c6952d05c7df \
  mongosh -u rootmongo -p minhasenhasecreta --authenticationDatabase herois

  show dbs
  use herois
  show collections

  db.herois.insert({
    nome: 'Batman',
    poder: 'Dinheiro',
    dataNascimento: '1900-02-03'
  })