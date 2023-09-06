import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from 'axios';

function LeitorCSV() {
  const [csvData, setCsvData] = useState([]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9000/ecommerce/todosproducts')
      .then(response => {
        setApiData(response); // Armazena os dados da API no estado
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  console.log(apiData)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        // console.log(result);
        // console.log(result.data);
        // console.log("ID do Produto: ", result.data[0].product_code);
        // console.log("Novo Preço: ", result.data[0].new_price);
      },
      header: true, // Se o CSV tiver cabeçalho
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            {csvData[0] &&
              Object.keys(csvData[0]).map((header) => (
                <th key={header}>{header}</th>
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

      <h2>Dados da API:</h2>
      <pre>{JSON.stringify(apiData, null, 2)}</pre>
    </div>
  );
}

export default LeitorCSV;
