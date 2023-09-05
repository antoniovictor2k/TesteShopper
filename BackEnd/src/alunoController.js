const { Aluno } = require('./alunoModel'); // Suponho que você tenha um modelo Aluno
const dbSequelize = require('./db'); // Importe a instância do Sequelize

const alunoController = {
  criarAluno: async (req, res) => {
    try {
      const { nome } = req.body;

      // Use a instância do Sequelize para criar um novo aluno
      const alunoCriado = await Aluno.create({ nome });

      res.status(201).json({ aluno: alunoCriado, msg: "Aluno criado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Erro ao criar Aluno" });
    }
  }
};

module.exports = alunoController;
