const express = require('express');
const alunoController = require('./alunoController');


const router = express.Router();

router.use(express.json());

router.post('/cadastro', alunoController.criarAluno);



module.exports = router;