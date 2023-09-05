const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

const dbSequelize = new Sequelize('teste', 'root', 'vi93462001', {
    host: 'localhost',
    dialect:'mysql'
  });

module.exports=dbSequelize;