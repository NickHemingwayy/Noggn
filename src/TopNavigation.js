import React, { useEffect, useRef, useState } from 'react';

import fire from './config/fire.js';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';

import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';

import icon from './Icon.png';

import './TopNavigation.css';


const auth = fire.auth();



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    
  root: {
    flexGrow: 1,  
  },
  appBar: {
    backgroundColor: '#2D2E4E',
    
  },
  title: {
    flexGrow: 1,
  },
  
  typography: {
    padding: theme.spacing(2),
  },
  toolbar: {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  
  ListItemIcon:{
    color: '#F1F2F8',
  },


  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));



export default function TopNavigation() {

const [user,setUser] = useState('');
const [photoURL,setProfPic] = useState('');
const [email, setEmail] = useState('');
const currUser = fire.auth().currentUser; 

const userRef = fire.firestore().collection("Users");



function getUser(){
  userRef.onSnapshot((querySnapshot) =>{
    let users = '';
    let profPic = '';
    let email = '';
    querySnapshot.forEach((doc)=>{
      if(doc.id === currUser.uid){
        users = doc.data().name;
        profPic = doc.data().photoURL;
        email = doc.data().email;
      }
    });
    setUser(users);
    setProfPic(profPic);
    setEmail(email);
  });
}

useEffect(() => {
  getUser();
}, []);

  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

 
  return (
    
    <ThemeProvider theme={theme}>
    
    <div className="background">
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          
          <img src={icon} width='70px' alt ="icon"></img>
          <Grid item xs />
          <IconButton onClick={goHome}>
            <HomeIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton>
            <GitHubIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton>
            <HelpIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton>
            <SettingsIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton 
           edge = 'end'
           onClick={handleProfileMenu}>
            <Avatar src={photoURL} className ={classes.small}/>
          </IconButton>
          <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
               <Typography className={classes.typography}>{user}
              </Typography>
            </Popover>
            

        </Toolbar>
      </AppBar>
      
        
       
           {/*} <ListItemIcon><Avatar src={photoURL} className={classes.small}/></ListItemIcon>
            <ListItemText>{user}</ListItemText> */}
          
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
    </div>
    

    </ThemeProvider>
    
  );
}

function Logout(){
  auth.signOut();
}

function goHome(){
  window.location.reload();
}

