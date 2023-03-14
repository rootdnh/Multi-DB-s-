  ## ---- POSTGRES

sudo docker run \
  --name my_postgres \
  -e POSTGRES_USER=rootdnh \
  -e POSTGRES_PASSWORD=mypass \
  -e POSTGRES_DB=herois \
  -p 5432:5432
  -d \
  postgres


# cliente
sudo docker run \
  --name adminer \
  -p 8080:8080 \
  --link my_postgres:my_postgres \
  -d \
  adminer 

  ## ---- MONGODB

sudo docker run \
  --name my_mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=rootadmin \
  -e MONGO_INITDB_ROOT_PASSWORD=mypass \
  -d \
  mongo \\Aqui pode instalar como mongo:latest 


# cliente mongo

sudo docker run \
  --name mongoclient \
  -p 3001:3001 \ 
  --link my_mongodb:27017 \
  -d \
  mongoclient/mongoclient

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link my_mongodb:my_mongodb \
    -d \
    mongoclient/mongoclient

sudo docker exec -it mongodb \
    mongosh --host localhost -u admin -p senhaadmin --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'rootmongo', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"

\\dependendo da versão do mongo o comando pode ser mongosh ou mongo