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
    const produtos = req.body.produtos;
    const somaInfo = [];
  
    if (!produtos || produtos.length === 0) {
      res.status(400).json({ error: 'Nenhum produto fornecido.' });
      return;
    }
  
    let algumProdutoAtualizado = false;
  

    for (const produto of produtos) {
      const { codigo, novoPreco } = produto;
  
      const produtoExistente = await dbSequelize.query(`SELECT * FROM products WHERE code = ${codigo}`, { type: dbSequelize.QueryTypes.SELECT });
  
      if (!produtoExistente || produtoExistente.length === 0) {
        res.status(404).json({ error: `Produto com código ${codigo} não encontrado.` });
        return;
      }
  
      const PegarDadosParaJson = await dbSequelize.query(`SELECT code as ID, name as Titulo,  sales_price as Preço, ${novoPreco} as Novo_Preço FROM products WHERE ${novoPreco} > cost_price and code = ${codigo}`, { type: dbSequelize.QueryTypes.SELECT });
      
      console.log('Testando: ' , PegarDadosParaJson);

      somaInfo.push(...PegarDadosParaJson);

      const precoMenorQueCusto = await dbSequelize.query(`SELECT code, cost_price, sales_price FROM products WHERE ${novoPreco} > cost_price and code = ${codigo}`, { type: dbSequelize.QueryTypes.SELECT });
  
      console.log("preço: ", precoMenorQueCusto[0].sales_price)
      const verificarSeEstaNoLimite = precoMenorQueCusto[0].sales_price
  
      const valorMaximoPermitido = verificarSeEstaNoLimite * (1 + 10 / 100);
      const valorMinimoPermitido = verificarSeEstaNoLimite * (1 - 10 / 100);
  
      console.log(valorMaximoPermitido, valorMinimoPermitido)
  
      if (precoMenorQueCusto.length > 0) {
  
        console.log('Testando novo preço se é > que o custo do produto: ');
        if (novoPreco >= valorMinimoPermitido && novoPreco <= valorMaximoPermitido) {
          console.log("Testando os 10%");
  
          await dbSequelize.query(`UPDATE products, packs SET sales_price = ${novoPreco} WHERE code = ${codigo}`);
  
          algumProdutoAtualizado = true;
        }
      }
    }
  
    if (algumProdutoAtualizado) {
      res.json(somaInfo);
    } else {
      res.json({ msg: 'Nenhum produto foi atualizado.' });
    }
  }
  


};

module.exports = ecommerceControlle;
