import React, { useState } from 'react';
import Papa from 'papaparse';

function LeitorCSV() {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        console.log(result);
        console.log(result.data);
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
            {csvData[0] && Object.keys(csvData[0]).map((header) => <th key={header}>{header}</th>)}
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
    </div>
  );
}

export default LeitorCSV;