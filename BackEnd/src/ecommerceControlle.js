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
  }
};

module.exports = ecommerceControlle;
