const express = require('express');
const dbSequelize = require('./db');
const ecommerceRouter = require('./ecommerceRouter');

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


app.use('/ecommerce', ecommerceRouter);

app.use('/teste', (req,res) => {
    res.send('TEstandoOK')
});

app.listen(9000, () => {
    console.log('Servidor funcionando..')
});


