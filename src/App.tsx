import "./App.css";
import Home from "./Home";
import { Route } from 'react-router-dom';
import { HashRouter } from "react-router-dom/cjs/react-router-dom";
import PokeDex from "./PokeDex";

function App() {
  return (
    <div>
      <HashRouter>
        <Route exact path="/" component={Home} />
        <Route path="/pokedex" component={PokeDex} />
      </HashRouter>
    </div>
  );
}

export default App;
