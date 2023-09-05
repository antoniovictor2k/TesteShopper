const { Sequelize, DataTypes } = require('sequelize');



const dbSequelize = require('./db');

const Aluno = dbSequelize.define('aluno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
},  
    {tableName:'aluno'}
)

module.exports = Aluno;