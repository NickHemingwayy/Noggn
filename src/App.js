import React, { Component } from 'react';
import './App.css';
import fire from './config/fire';
import Home from './Home.js';
import Login from './Login.js';
import DashBoard from './chatApp.js';
import TeamPage from './teams.js'
import IdeaBoard from './ideaBoard.js'
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      user: null,
    }

    this.authListener = this.authListener.bind(this);

  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({user});
      }else{
        this.setState({user:null});
      }
    });
  }
render(){
  return (
    <div> {/*can use className ='App' here*/}
        {/*this.state.user ? (<TeamPage/>):(<Login/>)*/}
        {<IdeaBoard/>}
    </div>
  );
}
}

export default App;
