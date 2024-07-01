import React from "react";
import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import PokeDex from "./PokeDex";

jest.mock("./Home", () => () => <div>Home Component</div>);
jest.mock("./PokeDex", () => () => <div>PokeDex Component</div>);

describe("App Component", () => {
  test("renders Home component by default", () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    expect(screen.getByText("Home Component")).toBeInTheDocument();
  });

  test("renders PokeDex component when navigating to /pokedex", () => {
    window.location.hash = "#/pokedex";
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );
    expect(screen.getByText("PokeDex Component")).toBeInTheDocument();
  });
});
