import React, { useEffect, useRef, useState } from 'react';
import fire from './config/fire.js';
import TextField from '@material-ui/core/TextField';
import './teams.css'
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import DashBoard from './chatApp.js';
import IdeaBoard from './ideaBoard.js';

import TopNavigation from './TopNavigation.js';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';
import theme from "./theme.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const firestore = fire.firestore();
const auth = fire.auth();


function TeamPage() {
  const [showForm, setState] = useState(false);
  const [user, setUser] = useState('');
  const currUser = fire.auth().currentUser;

  const userRef = fire.firestore().collection("Users");

  function getUser() {
    userRef.onSnapshot((querySnapshot) => {
      let users = '';
      querySnapshot.forEach((doc) => {
        if (doc.id === currUser.uid) {
          users = doc.data().name;
        }
      });
      setUser(users);
    });
  }

  useEffect(() => {
    getUser();
  }, []);
  

  const teamsRef = firestore.collection('Teams');
  const [room, setRoom] = useState('');
  
  function loadTeam(e){
    console.log(e.target.textContent)
    let chosenTeam = e.target.textContent;
    let roomID;
    let chosnTeam;
    teamsRef.onSnapshot((querySnapshot) => {
      let teamName = '';
      let admin;
      querySnapshot.forEach((doc) => {
        admin = doc.data().Admin;
        teamName = doc.data().teamName;
        if(teamName === chosenTeam){
          roomID = admin + teamName + '/' + admin + teamName;
          chosnTeam = teamName
        }

      });
      setRoom(roomID);
      setCurrTeamName(chosnTeam);
      console.log(roomID,chosnTeam);
    });
  }


  const [currentTeams, setTeamName] = useState([]);
  const [teamName, setCurrTeamName] = useState('');
  function getTeams() { // retrieves all teams in DB
    teamsRef.onSnapshot((querySnapshot) => {
      
      let teamNames = [];
      let teamName = '';
      let teamMembers;
      let membersString = '';
      let roomID;
      let admin;
      querySnapshot.forEach((doc) => {
        teamName = doc.data().teamName;
        teamMembers = doc.data().splitUsers;
        admin = doc.data().Admin
        
        //for(let i=0;i<teamMembers.length;i++){
          //membersString = membersString + '\n' + teamMembers[i];
        //} 
        if(teamMembers.includes(currUser.email) ){
         
          roomID = '/messages/' + admin + teamName + '/' + admin + teamName;
          teamNames.push(<div className ="teams" style={{alignItems: 'left'}}><Button style={{color: 'white', textTransform: 'capitalize'}} onClick={loadTeam} className="teamsButton">{teamName}</Button><p className="teamsp">{teamMembers[0]}</p><p className="teamsp">{teamMembers[1]}</p><p className="teamsp">{teamMembers[2]}</p></div>);
        }

      });
      setTeamName(teamNames);
    });
  }
  useEffect(() => {
    getTeams();
  }, []);
  console.log(room)
  return (
    <ThemeProvider theme={theme}>
        <div className='background'>
        <div className='ideaBoard'>
          {room ? <IdeaBoard room={'/Points/' + room}/> : null}
        </div>
        <div className='content'>
          
          {room ? <DashBoard room={'/messages/' + room} teamName={teamName}/> : <DisplayDashboard/>}
          
          <div className='currentTeams'>
            <div className="scroll">
          <div className='title'>
          <h2>Active Teams</h2>
          </div>
          <div className="teamsList">
          {room ? null:currentTeams}
          </div>
          </div>
          </div>
          </div>
          
        </div>
        
        <TopNavigation/>
    </ThemeProvider>
  )
}

function TeamForm() {
  const teamsRef = firestore.collection('Teams');
  const messagesRef = firestore.collection('messages');

  const [formValTeamName, setNameFormValue] = useState('');
  const [formValTeamUsers, setUsersFormValue] = useState('');

  const [currentTeams, setTeamName] = useState([]);
  const currUser = fire.auth().currentUser;


  function getTeams() { // retrieves all teams in DB
    teamsRef.onSnapshot((querySnapshot) => {
      let teamNames = [];
      let teamAdmin = [];
      querySnapshot.forEach((doc) => {

        teamNames.push([doc.data().teamName, doc.data().Admin]);

      });
      setTeamName(teamNames);
    });
  }

  useEffect(() => {
    getTeams();
  }, []);


  const addTeam = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    let splitUsers = formValTeamUsers.split(",");
    let validEmails = true;
    let validTeamName = true;

    for (let i = 0; i < splitUsers.length; i++) { //Correctly formats user emails to be pushed to DB array
      splitUsers[i] = splitUsers[i].trim();
      if (expression.test(splitUsers[i].toLocaleLowerCase()) === false) { //Validates each email string
        validEmails = false;
        break;
      }
    }

    // validates form details before uplaoding to DB, informs the user accordingly
    if (formValTeamName !== '' && formValTeamUsers !== '' && validEmails === true) {
      for (let i = 0; i < currentTeams.length; i++) {
        console.log(currentTeams[i])
        if (currentTeams[i].includes(formValTeamName) && currentTeams[i].includes(uid)) { // checks if user has already created a team by this name
          validTeamName = false;
        }
      }

      splitUsers.push(currUser.email)

      if (validTeamName === true) {
        await teamsRef.add({ // Pushes new team to DB
          Admin: uid,
          teamName: formValTeamName,
          splitUsers,
          teamID : uid+formValTeamName
        })
        const newChatRef = firestore.collection('messages/'+uid+formValTeamName+'/'+uid+formValTeamName);
        const newPointsRef = firestore.collection('Points/'+uid+formValTeamName+'/'+uid+formValTeamName);
        await newChatRef.add({ // Pushes new team to DB
          text: 'Welcome to your new Team!',
          createdAt: + new Date(),
          uid:'mEPP5vonIEe6rLayGVlnUPA6uGR2',
          photoURL: 'https://www.fkbga.com/wp-content/uploads/2018/07/person-icon-6.png',
          user: 'chatAssistant'
        })
        await newPointsRef.doc('node_1').set({
          key: 'node_1',
          value: formValTeamName + "'s" + " first node",
          outputs: [],
          url: '',
        })
        setNameFormValue('');
        setUsersFormValue('');
        alert("Team Created");
      }
      else {
        alert("You have already created a team with this name")
      }
    }
    else {
      alert("Please verify Fields")
    }
  }

  return (
    <div className="teamForm">
      <form onSubmit={addTeam}>
        <div className="textField">
          <TextField
            autoFocus
            margin="dense"
            id="teamName"
            label="Team Name"
            fullWidth
            required
            value={formValTeamName}
            onChange={(e) => setNameFormValue(e.target.value)}
          />
        </div>
        <div className="textField">
          <TextField
            autoFocus
            margin="dense"
            id="users"
            label="Team Member Emails"
            type="email"
            fullWidth
            multiline
            value={formValTeamUsers}
            onChange={(e) => setUsersFormValue(e.target.value)}
          />
        </div>
        <DialogActions>
          <Button color="primary" type="submit" variant='outlined'>
            Create Team
          </Button>
        </DialogActions>
        
      </form>
    </div>
  )
}

function DisplayDashboard(){
  const [user, setUser] = useState('');
  const currUser = fire.auth().currentUser;

  const userRef = fire.firestore().collection("Users");

  function getUser() {
    userRef.onSnapshot((querySnapshot) => {
      let users = '';
      querySnapshot.forEach((doc) => {
        if (doc.id === currUser.uid) {
          users = doc.data().name;
        }
      });
      setUser(users);
    });
  }

  useEffect(() => {
    getUser();
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return(
    <ThemeProvider theme={theme}>
          <div className="dashboard">
            <div className="createTeamDiv">
          <h1>Welcome, <span style={{ color: '#5855FC' }}>{user}</span>!</h1>
          <p className="welcomep">This is your personalized Noggn dashboard. </p>
          <p className="welcomep">Get started creating beautiful mind maps by clicking the button below, or select an active team.</p>
          <Button variant="contained" color="primary" onClick={handleClickOpen} style={{width: '40%'}}>
              Create Team
            </Button>
          
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" color='secondary'>Create a Noggn Team</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Add members by inputing their emails separated by commas. For example: test1@gmail.com, test2@gmail.com, test3@gmail.com.
              </DialogContentText>
              <TeamForm />
            </DialogContent>
          </Dialog>
          </div>
          <div className="bottomNavigation">
          <div className="bottomNavigationDiv">
            <h3>Not sure where to start?</h3>
            <Button variant="contained"  onClick={handleClickOpen} style={{width: '70%', backgroundColor: '#E789FF', color:'#FFFFFF', marginTop: '40px'}}>Visit Help Centre</Button>
          </div>
          <div className="bottomNavigationDiv" style={{marginLeft:'20px'}}>
            <h3>What are Mind Maps?</h3>
            <p>Mind maps are creative tools used for brainstorming ideas. In Noggn's case, mind maps are made up of nodes that represented by ideas connected by lines to show connections between ideas.</p>
            <p>Mind maps have so many great uses. Get started now by creating a team!</p>
          </div>
          </div>
          </div>
          
        </ThemeProvider>  )
}

export default TeamPage;