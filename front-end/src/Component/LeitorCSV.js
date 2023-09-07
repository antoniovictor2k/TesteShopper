import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";

function LeitorCSV() {
  const [csvData, setCsvData] = useState([]);
  const [apiData, setApiData] = useState([]);

  const [guarda_code, setGuarda_code] = useState ([]);
  const [guarda_code_csv, setGuarda_code_csv] = useState([]);
  const [guarda_precoBD, Setguarda_precoBD] =useState([]);
  const [guarda_precoLocal, Setguarda_precoLocal] =useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/ecommerce/todosproducts")
      .then((response) => {
        setApiData(response.data);
        console.log(response.data[0]);
        // Armazena os dados da API no estado
        const codigos= response.data.map(codgio=>codgio.code);
        setGuarda_code(codigos);
        
        const elementosDesejados = response.data.map(item => {
          return {
            id: item.code,
            preco: item.sales_price,
            custo: item.cost_price
          };
        });
          // console.log('teste: ', response.data.map(preco=> preco.code && preco.sales_price))
          console.log("test: ",elementosDesejados)

          Setguarda_precoBD(elementosDesejados);
          
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // console.log(apiData)
  // console.log(guarda_code);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        // console.log(result.data);
        const idCSV = result.data.map(code_produto => parseInt(code_produto.product_code)).slice(0,-1);
        setGuarda_code_csv(idCSV);

        const dadosCSV = result.data.map(dados => {

          return{
            id_produto: dados.product_code,
            novo_preco: dados.new_price
          }
        })

        console.log(dadosCSV);
        // console.log('teste: ',result.data.map(code_produto => code_produto.product_code).slice(0,-1));
        // console.log("ID do Produto: ", result.data[0].product_code);
        // console.log("Novo Preço: ", result.data[0].new_price);
      },
      header: true, // Se o CSV tiver cabeçalho
    });
  };

  function verificarElementos(array1, array2) {
    const elementosDiferentes = [];
  
    array1.forEach(elemento => {
      if (!array2.includes(elemento)) {
        elementosDiferentes.push(elemento);
      }
    });
  
    if (elementosDiferentes.length === 0) {
      console.log("Todos os elementos do primeiro array estão presentes no segundo array.");
    } else {
      console.log("Elementos diferentes encontrados no primeiro array:", elementosDiferentes);
    }
  }

  verificarElementos(guarda_code_csv, guarda_code);

  
  // console.log(guarda_code)
  // console.log(guarda_code_csv)
  // console.log(guarda_code_csv);

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            {csvData[0] &&
              Object.keys(csvData[0]).map((header) => (
                <th key={header}>  {header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button>Código Existe?</button>

      <button> + ou - dentro dos 10%?</button>

      <button>são números válidos?</button>
      <button>Novo Preço é menor que o custo?</button>

    </div>
  );
}

export default LeitorCSV;
