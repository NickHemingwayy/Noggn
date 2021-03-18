import React, { useEffect, useRef, useState } from 'react';
import fire from './config/fire.js';



import './chatApp.css';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';

import Badge from '@material-ui/core/Badge';
import theme from "./theme.js";

const firestore = fire.firestore();
const auth = fire.auth();



//
function DashBoard(MessagesRoom) {

  let navWidth = '';
  let toggleX = '380 px'
  let toggleInd = <ChevronLeftIcon />
  const [toggle, setState] = useState(true);

  console.log(toggle);


  if (toggle === false) {
    navWidth = '150px'
    toggleInd = <ChevronRightIcon color="primary" size="large" />
    toggleX = '130px'
  } else {
    navWidth = '400px'
    toggleInd = <ChevronLeftIcon color="primary" />
    toggleX = '380px'
  }

  let navStyle = {
    'width': navWidth
  }

  return (
    <ThemeProvider theme={theme}>
      <div>

        
        <div style={navStyle} className="rightNav">
          <div>
            <button style={{left:toggleX}} onClick={() => setState(!toggle)} className="toggle">{toggleInd}</button>
            {toggle ? <ChatApp {...MessagesRoom} /> : <ChatClose {...MessagesRoom} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}




function ChatApp(MessagesRoom) {
  const teamRef = fire.firestore().collection("Teams");
  let teamID = '';
  let membersString = ''
  let dbTeamMebers;
  let fileBase = /[^/]*$/.exec(MessagesRoom.room)[0];
  const [teamMembers,setTeamMembers] = useState('')
  teamRef.onSnapshot((querySnapshot) => {

    querySnapshot.forEach((doc) => {   
    teamID = doc.data().teamID;
    console.log(fileBase,teamID);
    if(fileBase == teamID){
      dbTeamMebers = doc.data().splitUsers
      
      for(let i=0;i<dbTeamMebers.length;i++){
        membersString = membersString + '\n' + dbTeamMebers[i];
      }
      setTeamMembers(membersString)
    }

    });
  });
    return (
    <div>
      <div className="headerSection">
      <h2 style={{textAlign:'center'}}><b>{MessagesRoom.teamName}</b></h2>
      <div className = "teamNameBlock">
      <div className ="teamName">
      <h3>Team Members</h3>
      {/*<p>Add New</p>
      <AddBoxIcon /> */}
      </div>
      <div className ="teamMembers">
      {teamMembers}
            
      </div>
      </div>
      
      
      
      
      
      </div>
      <div className="chatApp">
        <div className="chatAppSection">
          {<ChatRoom {...MessagesRoom} />}
        </div>

      </div>
    </div>
  );
}



// responsible for the inputs/writes to DB and receiving/returning the message for the open chat room
function ChatRoom(MessagesRoom) {

  const dummy = useRef();
  console.log(MessagesRoom)
  const messagesRef = firestore.collection(MessagesRoom.room);
  const query = messagesRef.orderBy('createdAt').limit(45);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const [user, setUser] = useState('');
  const [photoURL, setProfPic] = useState('');
  const currUser = fire.auth().currentUser;

  const userRef = fire.firestore().collection("Users");



  function getUser() {
    userRef.onSnapshot((querySnapshot) => {
      let users = '';
      let profPic = '';
      querySnapshot.forEach((doc) => {
        if (doc.id === currUser.uid) {
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
  console.log(user);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: + new Date(),
      uid,
      photoURL,
      user
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  function setScroll() {
    var msgDiv = document.getElementById("messagesDiv");
    //console.log(msgDiv);
    if (msgDiv !== null) {
      
      msgDiv.scrollTop = msgDiv.scrollHeight;
      
    }
  }

  
  const handleEnterPress = async(e) => {
    //it triggers by pressing the enter key
  if (e.keyCode === 13) {
    console.log(e);
    sendMessage();
  }
};

  return (<>


    <div id="messagesDiv">

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      {setScroll()}
    </div>
    
    <form onSubmit={sendMessage} className='chatForm'  >
      
        <TextField
          id="filled-multiline-flexible"
          label="Type Something"
          multiline
          rowsMax={2}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyUp={(e) =>{
            
            if (e.key === 'Enter') {
            sendMessage(e);
        }}}
          variant="filled"
          color='secondary'
          style={{ width: "90%" }}
          size='small'

        />
        <Button variant="contained" color="primary" type="submit" disabled={!formValue} style={{ width: "5%", marginRight: '10px', marginLeft: '10px' }}>Send</Button>
      
    </form>
  </>)
}

// Is used directly by the ChatRoom function to return the message and verify who sent it
function ChatMessage(props) {
  const { text, uid, photoURL, user, createdAt } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  const nameClass = uid === auth.currentUser.uid ? 'sent2' : 'received2';

  //Convert Unix time stamp to time
  var timeStamp = createdAt;
  var date = new Date(timeStamp);
  var utcString = date.toUTCString();
  var time = utcString.slice(-11, -7);

  return (<>
    <div className={`message ${messageClass}`}>
      
      
      <Avatar src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user} className='chatImg' />
      <div>
      <h6 className={`timeStamp ${messageClass}`}>{user}</h6>
      <Tooltip title={time} placement="left">
      <p className="textP">{text}</p>
      </Tooltip>
      </div>
      

    </div>
  </>)
}

//Gets the chat message and avatar values based on the team for chat close
function ChatClose(MessagesRoom) {
  const dummy = useRef();
  
  const messagesRef = firestore.collection(MessagesRoom.room);
  const query = messagesRef.orderBy('createdAt').limitToLast(8);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [user, setUser] = useState('');
  const [photoURL, setProfPic] = useState('');
  const currUser = fire.auth().currentUser;

  const userRef = fire.firestore().collection("Users");

  function getUser() {
    userRef.onSnapshot((querySnapshot) => {
      let users = '';
      let profPic = '';
      querySnapshot.forEach((doc) => {
        if (doc.id === currUser.uid) {
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

  return (
    <div className="chatAppClose">
      <div className="chatAppCloseTeamName">
        {MessagesRoom.teamName}
      </div>
      <div className="messagesSectionClose">
      <div className="chatAppCloseMessages">
      {messages && messages.map(msg => <ChatCloseMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      </div>
      </div>
    </div>
  )
}


//Sets the messages and avatars from the closed chat room 
function ChatCloseMessage(props) {

  const { text, photoURL, user, createdAt } = props.message;
  var timeStamp = createdAt;
  var date = new Date(timeStamp);
  var utcString = date.toUTCString();
  var time = utcString.slice(-11, -7);

  return (
    <div className="closeMsg">
      <Tooltip title={text} placement="left" interactive>
        <Avatar src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user} className='chatImgClose' />
      </Tooltip>
      <p style={{marginLeft: '15px', color: '#828282'}}>{time}</p> 
    </div>
  )
}


//export default ChatApp;
export default DashBoard;
