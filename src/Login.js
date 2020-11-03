import React from 'react';
import fire from './config/fire';
import firebase from 'firebase/app';

//MATERIAL UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';


//import logo from './logo.svg';
import './App.css';
import './login.css';
import mainLogo from './Logo Color.png';
import googleImage from './googlesignin.png';

    
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
        
        //Record Names in the User Collection along with UserID
        fire.auth().createUserWithEmailAndPassword(email,password)
        .then((u)=> {
          const user = fire.auth().currentUser; 
          var displayName = name; 
          const usernameRef = fire.firestore().collection('Users');
          usernameRef.add ({ 
                name: displayName,
                uid: user.uid //We want to include the UID along with the Name so it can be used later
          })
           
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
        })

    }

    //SIGN IN WITH GOOGLE AUTHENTICATION
    signInGoogle(){        
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        fire.auth().signInWithPopup(provider).then((u) =>{
            console.log(u.user)
        }).catch((err=>{
            console.log("Error: " + err.toString());
        }))
    }

    
    render(){
        return(
            <div className ='FormBox'>
            <div className = 'Form'>
        
                <img src ={mainLogo} />
                <h1>Welcome to Noggn.</h1>
                <h4>Create an account to start collaborating with your teams in real time. Or Sign in.</h4>
                <div className ='Field'>
            
            <TextField id="displayName" label="Full Name" variant="outlined" style={{width: '80%'}} />
              <div className ='Field'>
              <TextField id="email" label="Email" variant="outlined" style={{width: '80%'}} required/>
              </div>
            </div>
            <div className = 'Field'>
              
              <TextField id="password" label="Password" variant="outlined" type="password" style={{width: '80%'}} required />
            
            </div>
            <Button variant="contained" color="primary" onClick={this.login} style={{marginRight: '10px', marginTop: '10px'}}>Login</Button>
            <Button variant="contained" color="primary" onClick={this.signUp} style={{marginTop: '10px'}}>Sign Up for Free</Button>
            <div className="GoogleLogin">
            <h4>Or Sign in with</h4>
            </div>
            <button onClick={this.signInGoogle}><img src={googleImage} width='25px'></img></button>

           {/* <button style={{margin: '10px'}} onClick={this.login} className='LoginBtn'>Login</button>
            <button style={{margin: '10px'}} onClick={this.signUp} className='SignUpBtn'>Sign Up</button> */}
          </div>
          </div>
        )
    }
}

export default Login;
