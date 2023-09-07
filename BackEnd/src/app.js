const express = require('express');
const dbSequelize = require('./db');
const ecommerceRouter = require('./ecommerceRouter');
const cors = require('cors');

const app = express();
app.use(express.json());

dbSequelize.sync()
.then(() => {
  console.log('Modelos sincronizados com sucesso com o banco de dados');
    // Inicie seu servidor Express aqui
  })
  .catch((error) => {
    console.error('Erro ao sincronizar modelos com o banco de dados:', error);
  });
  
  
  
  // Configurar o cabeçalho para permitir solicitações do localhost:3000
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
  });
  
  app.use(cors()); 
  
app.use('/ecommerce', ecommerceRouter);

app.use('/teste', (req,res) => {
    res.send('TEstandoOK')
  });
  

  
  
  app.listen(9000, () => {
    console.log('Servidor funcionando..')
  });
  

