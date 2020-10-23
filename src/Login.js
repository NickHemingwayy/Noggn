import React from 'react';
import fire from './config/fire';
//import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//import logo from './logo.svg';
import './App.css';

class Login extends React.Component{

    login(){
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        fire.auth().signInWithEmailAndPassword(email,password).then((u)=> {
            console.log("Successfully Logged In");
        
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
        })
    }

    signUp(){
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        fire.auth().createUserWithEmailAndPassword(email,password).then((u)=> {
            console.log("Successfully Signed Up");
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
        })

    }
    
    render(){
        return(
            <div style={{ textAlign: 'center'}} className = 'Login'>
            <div>
              <div>Email</div>
              <TextField id="email" label="Email" variant="outlined" />
              {/*<input id="email" placeholder="Enter Email.." type="text"/> */}
            </div>
            <div>
              <div>Password</div>
              <TextField id="password" label="Password" variant="outlined" />
             {/* <input id="password" placeholder="Enter Password.." type="text"/> */}
            </div>
            <button style={{margin: '10px'}} onClick={this.login} className='LoginBtn'>Login</button>
            <button style={{margin: '10px'}} onClick={this.signUp} className='SignUpBtn'>Sign Up</button>
          </div>
        )
    }
}

export default Login;