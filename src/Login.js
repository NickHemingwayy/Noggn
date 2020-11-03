import React from 'react';
import fire from './config/fire';

//MATERIAL UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';


//import logo from './logo.svg';
import './App.css';
import './login.css';
import mainLogo from './Logo Color.png';

    
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
        const name = document.querySelector('#displayName').value;
        
        fire.auth().createUserWithEmailAndPassword(email,password)
        .then((u)=> {
          const user = fire.auth().currentUser; //get the current user 
          var displayName = name; //create a variable based on input in form
          const usernameRef = fire.firestore().collection('Users'); //create a record in users
          usernameRef.add ({ //add the display name and user id to the collection document
                name: displayName,
                uid: user.uid
          })
           
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
        })

    }

    
    render(){
        return(
            <div className ='FormBox'>
            <div className = 'Form'>
        
                <img src ={mainLogo} />
                <h1>Welcome to Noggn.</h1>
                <h4>Create an account to start collaborating with your teams in real time. Or Sign in.</h4>
                <div className ='Field'>
            
            <TextField id="displayName" label="Full Name" variant="outlined" fullwidth />
              <div className ='Field'>
              <TextField id="email" label="Email" variant="outlined" fullwidth required/>
              </div>
            </div>
            <div className = 'Field'>
              
              <TextField id="password" label="Password" variant="outlined" type="password" fullwidth required />
            
              <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            </div>
            <Button variant="contained" color="primary" onClick={this.login} style={{marginRight: '10px', marginTop: '10px'}}>Login</Button>
            <Button variant="contained" color="primary" onClick={this.signUp} style={{marginTop: '10px'}}>Sign Up for Free</Button>

           {/* <button style={{margin: '10px'}} onClick={this.login} className='LoginBtn'>Login</button>
            <button style={{margin: '10px'}} onClick={this.signUp} className='SignUpBtn'>Sign Up</button> */}
          </div>
          </div>
        )
    }
}

export default Login;
