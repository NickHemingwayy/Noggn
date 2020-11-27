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
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';
import theme from "./theme.js";

const firestore = fire.firestore();
const auth = fire.auth();



//
function DashBoard(MessagesRoom) {

  let navWidth = '';
  let toggleInd = <ChevronLeftIcon style={{ fontSize: '30px' }} />
  const [toggle, setState] = useState(true);
  console.log(toggle);



  if (toggle === false) {
    navWidth = '5%'
    toggleInd = <ChevronLeftIcon />
  } else {
    navWidth = '25%'
    toggleInd = <ChevronRightIcon />
  }

  let navStyle = {
    'width': navWidth
  }

  return (
    <ThemeProvider theme={theme}>
      <div>

        {/*This is where the left Navigation Comes in*/}
        <div style={navStyle} className="rightNav">
          <div>
            <button onClick={() => setState(!toggle)} className="toggle">{toggleInd}</button>
            {toggle ? <ChatApp {...MessagesRoom} /> : <ChatClose {...MessagesRoom} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}




function ChatApp(MessagesRoom) {

  return (
    <div>
      <div className="headerSection">

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
  const query = messagesRef.orderBy('createdAt').limit(25);

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
      console.log(msgDiv);
      console.log("Height = " + msgDiv.scrollHeight);
      console.log("Scrolled : " + msgDiv.scrollTop);
      msgDiv.scrollTop = msgDiv.scrollHeight;
      console.log("Scrolled after: " + msgDiv.scrollTop);
    }
  }


  return (<>


    <div id="messagesDiv">

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      {setScroll()}
    </div>
    <form onSubmit={sendMessage} className='chatForm' >
      <div className='chat'>
        <TextField
          id="outlined-multiline-flexible"
          label="Type Something"
          multiline
          rowsMax={2}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          variant="outlined"
          color='secondary'
          style={{ width: "70%" }}
          size='small'

        />
        <Button variant="contained" color="primary" type="submit" disabled={!formValue} style={{ width: "5%", marginRight: '10px', marginLeft: '10px' }}>Send</Button>
      </div>
    </form>
  </>)
}

// Is used directly by the ChatRoom function to return the message and verify who sent it
function ChatMessage(props) {
  const { text, uid, photoURL, user, createdAt } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  //Convert Unix time stamp to time
  var timeStamp = createdAt;
  var date = new Date(timeStamp);
  var utcString = date.toUTCString();
  var time = utcString.slice(-11, -7);

  return (<>
    <div className={`message ${messageClass}`}>
      <Tooltip title={user}>
        <Avatar src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user} className='chatImg' />
      </Tooltip>
      <p className="textP">{text}</p>
      <h6 className="timeStamp">{time}</h6>

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

      {messages && messages.map(msg => <ChatCloseMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
    </div>
  )
}


//Sets the messages and avatars from the closed chat room 
function ChatCloseMessage(props) {

  const { text, photoURL, user } = props.message;

  return (
    <div className="chatAppCloseMessages">
      <Tooltip title={text} placement="left" interactive>
        <Avatar src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user} className='chatImg' />
      </Tooltip>
    </div>
  )
}


//export default ChatApp;
export default DashBoard;
