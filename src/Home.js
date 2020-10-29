import React, { Component } from 'react';
import fire from './config/fire';
import logo from './logo.svg';
import './App.css';

class Home extends Component{

    logout(){
        fire.auth().signOut();
    }

  
    render(){
        return(
            <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>Welcome to Noggn.</p>
            <button onClick = {this.logout}>Logout</button>
            </header>
          </div>
        )
    }
}

export default Home;