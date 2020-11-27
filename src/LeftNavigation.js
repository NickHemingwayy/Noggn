import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import fire from './config/fire.js';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';


import icon from './Icon.png';
import Profile from './profile.js';

import './LeftNavigation.css';


const auth = fire.auth();



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#2D2E4E',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  ListItem:{
    paddingTop: 15,
    paddingBottom:  15
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
    
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  ListItemIcon:{
    color: '#2D2E4E',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));



export default function LeftNavigation() {

const [user,setUser] = useState('');
const [photoURL,setProfPic] = useState('');
const currUser = fire.auth().currentUser; 

const userRef = fire.firestore().collection("Users");



function getUser(){
  userRef.onSnapshot((querySnapshot) =>{
    let users = '';
    let profPic = '';
    querySnapshot.forEach((doc)=>{
      if(doc.id === currUser.uid){
        users = doc.data().name;
        profPic = doc.data().photoURL;
      }
    });
    setUser(users);
    setProfPic(profPic);
  });
}

useEffect(() => {
  getUser();
}, []);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

 
  return (
    <Router>
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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <img src={icon} width='70px' alt ="icon"></img>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon color='primary'/> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        
        <List>
          {/* HOME */}
          
          
          <ListItem button className={classes.ListItem} onClick={goHome}>
            <ListItemIcon><HomeIcon color='primary'></HomeIcon></ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
         
          {/* TEAMS */}
          <ListItem button className={classes.ListItem}>
            <ListItemIcon><GroupIcon color='primary'></GroupIcon></ListItemIcon>
            <ListItemText>Teams</ListItemText>
          </ListItem>
          {/* HELP */}
          <ListItem button className={classes.ListItem}>
            <ListItemIcon><HelpIcon color='primary'></HelpIcon></ListItemIcon>
            <ListItemText>Help Center</ListItemText>
          </ListItem>
          {/* GITHUB */}
          <ListItem button className={classes.ListItem}>
            <ListItemIcon><GitHubIcon color='primary'></GitHubIcon></ListItemIcon>
            <ListItemText>GitHub</ListItemText>
          </ListItem>
        </List>

        <Divider />
        <List>
          {/* LOGOUT */}
          <ListItem button className={classes.ListItem} onClick={Logout}>
            <ListItemIcon><ExitToAppIcon color='primary'></ExitToAppIcon></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItem>
          {/* SETTINGS */}
          <ListItem button className={classes.ListItem}>
            <ListItemIcon><SettingsIcon color='primary'></SettingsIcon></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItem>
          {/* PROFILE */}
          <ListItem button className={classes.ListItem}>
            <ListItemIcon><Avatar src={photoURL} className={classes.small}/></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </ListItem>
        </List>

      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
    </div>
    

    </ThemeProvider>
    </Router>
  );
}

function Logout(){
  auth.signOut();
}

function goHome(){
  window.location.reload();
}

