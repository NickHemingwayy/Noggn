import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Link } from "react-router-dom"; //Import Links



function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Noggn.
          
        </p>
        {/* Link Component */}
        <Link to="/materialuitest"><button>
          Go to page 2
        </button>
        </Link>
      </header>
    </div>
  );
}

export default App;
