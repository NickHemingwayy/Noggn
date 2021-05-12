import React, { useEffect, useRef, useState } from 'react';

import fire from './config/fire.js';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import clsx from 'clsx';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Badge from '@material-ui/core/Badge';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
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
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import icon from './logo.svg';

import './css/TopNavigation.css';

import HelpCentre from './HelpCentre.js'



const firestore = fire.firestore();
const auth = fire.auth();

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    
  root: {
    flexGrow: 1,  
    
  },
  avatarRoot: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  appBar: {
    backgroundColor: '#FFFFFF',
    boxShadow: 'none',
  },
  title: {
    flexGrow: 1,
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
    color: '#6A67FF',
  },

  button:{
    color: '#2D2E4E',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginLeft: '50'
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },

  dialog:{
    padding: '100px',
    color: '#2D2E4E',
  },
  dialogTitle:{
    color: '#2D2E4E',
    paddingTop: '30px',
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingBottom: '10px'
  },
  dialogAccordian:{
    paddingLeft: '30px',
    paddingRight: '30px',
    paddingBottom: '30px'
  },
  logoButton: {
    marginLeft: theme.spacing(3),
    cursor: 'pointer'
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

  const [helpOpen, setOpen]  = React.useState(false);

  const profileOpen = Boolean(anchorEl);
  const id = profileOpen ? 'simple-popover' : undefined;

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleHelpOpen = () =>{
    setOpen(true);
  }

  const handleHelpClose = () => {
    setOpen(false);
  }
  
 
 
  return (
    
    <ThemeProvider theme={theme}>
    
    <div className="background">
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: profileOpen,
        })}
      >
        <Toolbar>
          <img src={icon} width='80px' alt ="icon" onClick={goHome} className= {classes.logoButton}></img>
          <Grid item xs />
          
            
          <Button onClick={goHome} className={classes.button}>
            Home
          </Button>
          
          <Button className={classes.button} href="https://github.com/NickHemingwayy/Noggn">
            Github
          </Button>
          
          <Button
            onClick ={handleHelpOpen}
            className={classes.button}
          >
            Help Centre
          </Button>
          
          <Dialog
            open={helpOpen}
            onClose={handleHelpClose}
            
          >

            <DialogTitle className = {classes.dialogTitle}>Noggn Help Centre <HelpIcon /></DialogTitle>

            <DialogContentText className = {classes.dialogTitle}>
            Welcome to Noggn's Help Centre. Here, you'll find answers to any questions you may have on how to use Noggn!
            </DialogContentText>

            <DialogContentText className = {classes.dialogAccordian}>
            <HelpCentre />
            </DialogContentText>

          </Dialog>

          <IconButton>
            <SettingsIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton 
           edge = 'end'
           onClick={handleProfileMenu}>
              <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
            <Avatar src={photoURL} className ={classes.small}/>
            </StyledBadge>
          </IconButton>
          <Popover
                id={id}
                open={profileOpen}
                anchorEl={anchorEl}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <p className="profileText" > Signed in as <span style={{color: '#6A67FF'}}>{user}</span></p>

              
              <p className = 'profileText'>{email}</p>
              <Button onClick={logout} style={{paddingLeft: '20px', paddingRight: '20px'}}><ExitToAppIcon className={classes.ListItemIcon}/>Logout</Button>
            </Popover>
            

        </Toolbar>
      </AppBar>          
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
    </div>
    

    </ThemeProvider>
    
  );



function logout(){
  fire.auth().signOut();
}


function goHome(){
  window.location.reload();
}
}
