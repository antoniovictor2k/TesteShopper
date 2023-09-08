import logo from "./logo.svg";
import LeitorCSV from "./Component/LeitorCSV";
import "./App.css";

function App() {
  
  const corRed = 'red'
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Leitor de arquivo.CSV Shopper</h3>
        <LeitorCSV />

        <div style={{display:'flex',gap:20}}>
          <button style={{backgroundColor: corRed, color:'#eeeeee', fontSize:20, width:150, padding:10, borderRadius: 12, borderStyle:'none' , cursor:'pointer'}}>Validar</button>

          <button style={{backgroundColor:'#555555', color:'#eeeeee', fontSize:20, width:150, padding:10, borderRadius: 12, borderStyle:'none' , cursor:'pointer'}}>Atualizar</button>
          <button style={{backgroundColor:'#555555', color:'#eeeeee', fontSize:20, width:150, padding:10, borderRadius: 12, borderStyle:'none' , cursor:'pointer'}}>Atualizar</button>
        </div>
      </header>
    </div>
  );
}

export default App;
