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
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

<<<<<<< HEAD




=======
>>>>>>> Noggn/dev
const firestore = fire.firestore();
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

  dialog:{
    padding: '50'
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
  
  const [expanded, setExpanded] = React.useState(false);

  const handleAccordianChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 
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
          <img src={icon} width='60px' alt ="icon" onClick={goHome} className= {classes.logoButton}></img>
          <Grid item xs />
          <IconButton onClick={goHome}>
            <HomeIcon className ={classes.ListItemIcon}/>
          </IconButton>
          <IconButton>
            <GitHubIcon className ={classes.ListItemIcon}/>
          </IconButton>
          {/*TODO: Build help center dialog */}

          <IconButton
            onClick ={handleHelpOpen}
          >
            
            <HelpIcon className ={classes.ListItemIcon}/>
          </IconButton>

          <Dialog
            open={helpOpen}
            onClose={handleHelpClose}
            className = {classes.dialog}
          >

            <DialogTitle>Noggn Help center</DialogTitle>

            <DialogContentText>
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.secondaryHeading}>Dashboard</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.secondaryHeading}>
            Create Team
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          
          <Typography className={classes.secondaryHeading}>
            Chat
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Mind Map Creation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
              </DialogContentText>

          </Dialog>

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
                <Typography className={classes.typography}>Signed in as</Typography>
               <Typography className={classes.typography}>{user}
              </Typography>
              <Typography className = {classes.typography}>{email}</Typography>
              <Button onClick={logout}><ExitToAppIcon/>Logout</Button>
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


function Logout(){
  firestore.auth.signOut();
<<<<<<< HEAD

}
function logout(){
  fire.auth().signOut();
=======
>>>>>>> Noggn/dev
}


function goHome(){
  window.location.reload();
}
}
