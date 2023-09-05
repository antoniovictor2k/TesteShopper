const dbSequelize = require('./db');


// Sincronize os modelos com o banco de dados antes de iniciar o servidor Express


const ecommerceControlle = {


  listaproducts: async (req, res) => {
    try {
      const result = await dbSequelize.query('SELECT * FROM products', { type: dbSequelize.QueryTypes.SELECT });
      res.json(result);
    } catch (error) {
      console.error('Erro na consulta:', error);
      res.status(500).json({ error: 'Erro na consulta' });
    }
  },

  listapacks: async (req, res) => {
    try {
      const result = await dbSequelize.query('SELECT * FROM packs', { type: dbSequelize.QueryTypes.SELECT });
      res.json(result);
    } catch (error) {
      console.error('Erro na consulta:', error);
      res.status(500).json({ error: 'Erro na consulta' });
    }
  },


  atualizarProduto: async (req, res) => {
    const { codigo, novoPreco } = req.body;

    // Verifique se o produto com o código fornecido existe
    const produtoExistente = await dbSequelize.query(`SELECT * FROM products WHERE code = ${codigo}`, { type: dbSequelize.QueryTypes.SELECT });

    if (!produtoExistente || produtoExistente.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Atualize o valor do produto
    await dbSequelize.query(`UPDATE products SET cost_price = ${novoPreco} WHERE code = ${codigo}`);

    res.json({ msg: 'Valor do produto atualizado com sucesso.' });
}


};

module.exports = ecommerceControlle;
