// Alterar de acordo com o seu banco de dados!
const schema = "antonio"; 
const user = "root";
const password = "vi93462001";
// 


const  Sequelize  = require('sequelize');

const dbSequelize = new Sequelize(schema, user, password, {
    host: "localhost",
    dialect:"mysql"
  });

module.exports = dbSequelize;