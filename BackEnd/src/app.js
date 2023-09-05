const express = require('express');
const alunoRouter = require('./alunosRouter');

const app = express();
app.use(express.json());


app.use('/alunos', alunoRouter);

app.listen(9000, () => {
    console.log('Servidor funcionando..')
});