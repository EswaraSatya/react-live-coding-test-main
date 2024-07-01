import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./App.css";

function Home() {
  const [text, setText] = useState < string > ("");

  return (
    <div className="App">
      <header className="App-header">
        <NavLink to="/pokedex">
          <img
            hidden={text !== "Ready!"}
            src="https://www.freeiconspng.com/uploads/file-pokeball-png-0.png"
            className="App-logo"
            alt="logo"
            style={{ padding: "10px" }}
          />
        </NavLink>
        <b>
          Requirement: Try to show the hidden image and make it clickable that
          goes to /pokedex when the input below is "Ready!" remember to hide the
          red text away when "Ready!" is in the textbox.
        </b>
        <p>Are you ready to be a pokemon master?</p>
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          name="name"
        />
        {text !== "Ready!" && (
          <span style={{ color: "red" }}>I am not ready yet!</span>
        )}
      </header>
    </div>
  );
}

export default Home;
