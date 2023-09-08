import logo from "./logo.svg";
import LeitorCSV from "./Component/LeitorCSV";
import "./App.css";

function App() {
  
 
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Leitor de arquivo.CSV Shopper</h3>
        <LeitorCSV />

       
      </header>
    </div>
  );
}

export default App;
