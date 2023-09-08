import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";

function LeitorCSV() {
  const [csvData, setCsvData] = useState([]);

  // guarda false ou true para cada verificação.

  const [codigo_existe, setCodigo_existe] = useState("red");
  const [dentro_10, setDentro_10] = useState("red");
  const [numeros_validos, setNumeros_validos] = useState("red");
  const [npreco_custo, setNpreco_custo] = useState("red");
  const [buttonAtualizar, setButtonAtualizar] = useState(0.1);

  //

  const resultado = [];
  let dentro10Status = "green"; // Inicialmente, definimos como 'green'
  let custoStatus = "green";

  const [guarda_code, setGuarda_code] = useState([]);

  const [guarda_dateBD, Setguarda_dateBD] = useState([]);
  const [guarda_dateLocal, Setguarda_dateLocal] = useState([]);

  const [resAtualizar, setResAtualizar] = useState([]);

  const validacaoOK =
    codigo_existe === "green" &&
    dentro_10 === "green" &&
    numeros_validos === "green" &&
    npreco_custo === "green";

  console.log(validacaoOK);

  useEffect(() => {
    axios
      .get("http://localhost:9000/ecommerce/todosproducts")
      .then((response) => {
        console.log(response.data[0]);
        // Armazena os dados da API no estado
        const codigos = response.data.map((codgio) => codgio.code);
        setGuarda_code(codigos);

        const elementosDesejados = response.data.map((item) => {
          return {
            id: item.code,
            nome: item.name,
            preco: item.sales_price,
            custo: item.cost_price,
          };
        });
        // console.log('teste: ', response.data.map(preco=> preco.code && preco.sales_price))
        console.log("test: ", elementosDesejados);

        Setguarda_dateBD(elementosDesejados);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  async function atualizarProdutos() {
    const produtosParaAtualizar = guarda_dateLocal;

    const data = {
      produtos: produtosParaAtualizar,
    };

    try {
      const response = await axios.put(
        "http://localhost:9000/ecommerce/atualizarpreco",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Resposta:", response.data);
      setResAtualizar(response.data);
    } catch (error) {
      console.error("Erro:", error.response.data.error);
      setResAtualizar(error.response.data.error);
    }
  }

  // console.log(apiData)
  // console.log(guarda_code);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // Corrigir o bug que dá ao valida sem nenhum dado.
    setCodigo_existe("red");
    setNpreco_custo("red");
    setDentro_10("red");
    setButtonAtualizar(0.1);
    setResAtualizar([]);

    Setguarda_dateLocal([]);
    let isAllValid = true; // Variável para rastrear se todos os dados são válidos

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);

        const dadosCSV = result.data
          .map((dados, index) => {
            const codigo = parseInt(dados.product_code);
            const novoPreco = parseFloat(dados.new_price);

            if (isNaN(codigo) || isNaN(novoPreco)) {
              if (index !== result.data.length - 1) {
                // Se não for a última linha, marque como inválido
                console.error(`Erro na linha ${index + 1}: Dados inválidos`);
                isAllValid = false;
              }
              return null;
            }

            return {
              codigo,
              novoPreco,
            };
          })
          .filter((dados) => dados !== null);

        if (isAllValid) {
          setNumeros_validos("green"); // Define como 'green' se todos os dados forem válidos
        } else {
          setNumeros_validos("red"); // Define como 'red' se houver dados inválidos
        }

        console.log(dadosCSV);

        Setguarda_dateLocal(dadosCSV);
      },
      header: true, // Se o CSV tiver cabeçalho
    });
  };

  // verificando se os codigos existe no bd.

  function verificarElementos() {
    const array1 = guarda_dateLocal.map((cod) => cod.codigo);
    const array2 = guarda_code;

    const elementosDiferentes = [];

    array1.forEach((elemento) => {
      if (!array2.includes(elemento)) {
        elementosDiferentes.push(elemento);
      }
    });

    if (elementosDiferentes.length === 0) {
      console.log(
        "Todos os elementos do primeiro array estão presentes no segundo array."
      );
      setCodigo_existe("green");
    } else {
      console.log(
        "Elementos diferentes encontrados no primeiro array:",
        elementosDiferentes
      );
      setCodigo_existe("red");
    }
  }

  // fim verificação se os codigos existe no bd.

  // verificando se os novos valores estão dentro dos 10% pra + ou -.

  function verificaNovoPreco() {
    // Arrays com os preços atuais e os novos preços
    const precoAtualArray = guarda_dateBD;

    const novoPrecoArray = guarda_dateLocal;
    const resultado = [];

    // Criar um objeto de mapeamento com base no ID para os preços atuais

    for (const novoPrecoItem of novoPrecoArray) {
      const { codigo, novoPreco } = novoPrecoItem;
      const precoAtualObj = precoAtualArray.find((item) => item.id === codigo);

      if (precoAtualObj) {
        const precoAtual = precoAtualObj.preco;
        const custo = precoAtualObj.custo;

        const limiteSuperior = precoAtual * 1.1; // 10% de aumento
        const limiteInferior = precoAtual * 0.9; // 10% de diminuição

        if (novoPreco <= limiteSuperior && novoPreco >= limiteInferior) {
          resultado.push({ codigo, status: "Dentro de 10%" });
        } else {
          resultado.push({ codigo, status: "Fora dos 10%" });
          dentro10Status = "red"; // Defina para 'red' se o novo preço estiver fora dos 10%
        }

        // Verifique a comparação com o custo aqui
        if (novoPreco < custo) {
          custoStatus = "red"; // Defina para 'red' se o novo preço for menor que o custo
        }
      } else {
        resultado.push({ codigo, status: "Produto não encontrado" });
      }
    }

    // Definir o estado do custo
    return resultado;
  }

  console.log("tecsvData: ", csvData);

  const handleClick = () => {
    if (csvData.length === 0) {
      console.log(true);
      alert("Por Favor Escolhar um Arquivo.csv");
      return;
    } else {
      console.log(false);
      setButtonAtualizar(1);
    }

    verificarElementos();
    verificaNovoPreco();

    // Verificar o resultado e definir o estado com base nele
    const hasProdutoNaoEncontrado = resultado.some(
      (item) => item.status === "Produto não encontrado"
    );

    if (hasProdutoNaoEncontrado || dentro10Status === "red") {
      setDentro_10("red"); // Se algum não estiver dentro dos padrões, define como 'red'
    } else {
      setDentro_10("green"); // Caso contrário, define como 'green'
    }
    // Defina o estado do custoStatus aqui
    setNpreco_custo(custoStatus);
  };

  // limpar campos

  function limparTela() {
    setCodigo_existe("red");
    setNpreco_custo("red");
    setNumeros_validos("red");
    setDentro_10("red");
    setButtonAtualizar(0.1);
    setCsvData([]);
  }

  const funcaoUptade = () => {
    if (validacaoOK) {
      // Todos os valores são "green", faça algo aqui
      console.log('Todos os valores estão em "green"');

      atualizarProdutos();
      limparTela();
    } else {
      // Pelo menos um valor não é "green", faça algo aqui
      console.log('Pelo menos um valor não está em "green"');
      alert("Validações ou validação ausente(s)! Revise e tente novamente");
    }
  };

  //fim verificação se os novos valores estão dentro dos 10% pra + ou -.

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
     
     {csvData.length > 0 &&
      <table
        style={{
          marginTop: 15,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "white",
        }}
      >
        <thead>
          <tr>
            {csvData[0] &&
              Object.keys(csvData[0]).map((header) => (
                <th
                  style={{
                    borderWidth: 0,
                    borderStyle: "solid",
                    borderColor: "#cccccc",
                    borderBottomWidth: 1,
                    paddingLeft: 20,
                  }}
                  key={header}
                >
                  {" "}
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {csvData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, index) => (
                <td
                  style={{
                    borderWidth: 0,
                    borderStyle: "solid",
                    borderColor: "#cccccc",
                    borderBottomWidth: 1,
                  }}
                  key={index}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <pre style={{ fontSize: 16 }}>
          <span style={{ backgroundColor: "red" }}> </span> Não passou na
          validação
        </pre>
        <pre style={{ fontSize: 16 }}>
          <span style={{ backgroundColor: "green" }}> </span> Passou na
          validação
        </pre>
      </div>

      <div style={{ marginTop: 20, marginBottom: 20, display: "flex", gap: 5 }}>
        <div
          style={{
            padding: 5,
            backgroundColor: codigo_existe,
            fontSize: 16,
            width: 120,
            borderRadius: 12,
          }}
        >
          Código Existe?
        </div>
        <div
          style={{
            padding: 5,
            backgroundColor: dentro_10,
            fontSize: 16,
            width: 180,
            borderRadius: 12,
          }}
        >
          + ou - dentro dos 10%?
        </div>
        <div
          style={{
            padding: 5,
            backgroundColor: numeros_validos,
            fontSize: 16,
            width: 160,
            borderRadius: 12,
          }}
        >
          São números válidos?
        </div>
        <div
          style={{
            padding: 5,
            backgroundColor: npreco_custo,
            fontSize: 16,
            width: 250,
            borderRadius: 12,
          }}
        >
          Novo Preço é maior que o custo?
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
          marginBottom: 20,
        }}
      >
        {resAtualizar.map((item, index) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              borderStyle: "solid",
              padding: 6,
              borderWidth: 1,
            }}
            key={index}
          >
            <p style={{ fontSize: 18 }}>ID: {item.ID}</p>
            <p style={{ fontSize: 18 }}>Título: {item.Titulo}</p>
            <p style={{ fontSize: 18 }}>Preço: {item.Preço}</p>
            <p style={{ fontSize: 18 }}>Novo Preço: {item.Novo_Preço}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button
          onClick={handleClick}
          style={{
            backgroundColor: "#555555",
            color: "#eeeeee",
            fontSize: 20,
            width: 150,
            padding: 10,
            borderRadius: 12,
            borderStyle: "none",
            cursor: "pointer",
          }}
        >
          Validar
        </button>

        <button
          onClick={funcaoUptade}
          style={{
            backgroundColor: "#555555",
            color: "#eeeeee",
            fontSize: 20,
            width: 150,
            padding: 10,
            borderRadius: 12,
            borderStyle: "none",
            cursor: "pointer",
            opacity: buttonAtualizar,
          }}
        >
          Atualizar
        </button>
      </div>
    </div>
  );
}

export default LeitorCSV;
