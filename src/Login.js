import React from 'react';
import fire from './config/fire';
import firebase from 'firebase/app';

//MATERIAL UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from "@material-ui/core/styles";
//import Alert from '@material-ui/lab/Alert';


//import logo from './logo.svg';
//import './App.css';
import './login.css';
import mainLogo from './Logo Color.png';
import googleImage from './googlesignin.png';

const styles = {
  input: {
    color: "#2D2E4E",
  }
};

class Login extends React.Component{

    login(){
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        fire.auth().signInWithEmailAndPassword(email,password).then((u)=> {
            console.log("Successfully Logged In");
        
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
            document.getElementById("login-error").innerHTML = "We couldn't find an account that matched. Please try again."
            
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
          usernameRef.doc(user.uid).set ({ 
                name: displayName,
                uid: user.uid, //We want to include the UID along with the Name so it can be used later
                photoURL: 'data:image/png;base64,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'
                 
          })
           
        })
        .catch((err) => {
            console.log("Error: " + err.toString());
            document.getElementById("signup-error").innerHTML = "Your password must be more than 6 characters. Please try again."
        })

    }

    //SIGN IN WITH GOOGLE AUTHENTICATION
    signInGoogle(){        
        var provider = new firebase.auth.GoogleAuthProvider();
        //provider.addScope('profile');
       // provider.addScope('email');
        fire.auth().signInWithPopup(provider).then((u) =>{
            //get the current user
            const user = fire.auth().currentUser;
            //add the google information to the users collection
                const googleAccountRef = fire.firestore().collection('Users');
                googleAccountRef.doc(user.uid).set ({ 
                name: user.displayName,
                uid: user.uid, 
                photoURL: user.photoURL
          })
            
            
        }).catch((err=>{
            alert("We're sorry, something went wrong. Please try again.")
            console.log("Error: " + err.toString());
            
        }))
    }

    
    render(){
        const { classes } = this.props;
        return(
            <div>
            
            <div className ='Image'>
            
            <div className ='FormBox'>
            <div className = 'Form'>
        
                <img src ={mainLogo} />
                <h1>Welcome to Noggn.</h1>
                <h4>Create an account to start collaborating with your teams in real time. Or Sign in.</h4>
                <div className ='Field'>
            
            <TextField id="displayName" label="Full Name" variant="outlined" style={{width: '80%'}} className={ classes.input} color="#2D2E4E"/>
              <div className ='Field'>
              <TextField id="email" label="Email" variant="outlined" style={{width: '80%'}} className={classes.input} required/>
              
              </div>
            </div>
            <div className = 'Field'>
              
              <TextField id="password" label="Password" variant="outlined" type="password" style={{width: '80%'}} className= {classes.input} required />
              <div id="login-error" className="errorMessage"></div>
              <div id="signup-error" className="errorMessage"></div>
            </div>
            
            <Button variant="contained" color="primary" onClick={this.login} style={{marginRight: '10px', marginTop: '10px'}}>Login</Button>
            <Button variant="contained" color="primary" onClick={this.signUp} style={{marginTop: '10px'}}>Sign Up for Free</Button>
            <div className="GoogleLogin">
            <h4>Or Sign in with</h4>
            </div>
            <button onClick={this.signInGoogle}><img src={googleImage} width='25px'></img></button>
          </div>
          </div>
          </div>
          </div>
          
        )
    }
}

export default withStyles(styles)(Login);
