import React, { useEffect, useRef, useState } from 'react';
import fire from './config/fire.js';
import TextField from '@material-ui/core/TextField';
import './chatApp.css';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import LeftNav from './LeftNavigation.js';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const firestore = fire.firestore();
const auth = fire.auth();
const analytics = fire.analytics();



//
function RightNav(){

  let navWidth = '';
  let toggleInd = <ChevronLeftIcon style={{fontSize: '30px'}}/>
  const [toggle, setState] = useState(true);
  console.log(toggle);


  if(toggle == false){
    navWidth = '5%'
    toggleInd = <ChevronLeftIcon/>
  }else{
    navWidth = '25%'
    toggleInd = <ChevronRightIcon/>
  }

  let navStyle = {
    'width': navWidth
  }
  
  return(
    <div>

      <LeftNav/> {/*This is where the left Navigation Comes in*/}
    <div style = {navStyle} className="rightNav">
      <div>
      <button onClick = {() => setState(!toggle)} className="toggle">{toggleInd}</button>
      {toggle ? <ChatApp/> : null}
      </div>
    </div>
    </div>
    
  )
}




function ChatApp() {
  
  const [user] = useAuthState(auth);
  
  

  return (
    <div>
    <div className ="headerSection">
      <h1>this is where the timer will go</h1>
      
        <button onClick = {Logout} className="logoutBtn">Logout</button>
        <hr></hr>
      </div>
      <div className="chatApp">
      <div className="chatAppSection">
        {<ChatRoom />}
      </div>
      
    </div>
    </div>
  );
}



// responsible for the inputs/writes to DB and receiving/returning the message
function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const [user,setUser] = useState('');
  const [photoURL,setProfPic] = useState('');
  const currUser = fire.auth().currentUser; 

  const userRef = fire.firestore().collection("Users");

  

  function getUser(){
    userRef.onSnapshot((querySnapshot) =>{
      let users = '';
      let profPic = '';
      querySnapshot.forEach((doc)=>{
        if(doc.id == currUser.uid){
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

    const { uid} = auth.currentUser;

    //TODO: Add name into message collection
   // const name = GetName;

    await messagesRef.add({
      text: formValue,
      createdAt: + new Date(),
      uid,
      photoURL,
      user
      
      //name: GetName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  function setScroll(){
    var msgDiv = document.getElementById("messagesDiv");
    //console.log(msgDiv);
    if(msgDiv !== null){
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
    
    
    <form onSubmit={sendMessage} >
    
    <TextField
          id="outlined-multiline-flexible"
          label="Type Something"
          multiline
          rowsMax={2}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          variant="outlined"
          style={{width: "80%"}}
          
        />
        
     {/* <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="New Message..." /> */}
    
      <button type="submit" disabled={!formValue} className="submitBtn"><SendIcon style={{color:'#5855FC', fontSize: '30px'}}/></button>

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
      <Avatar src= {photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user} className='chatImg'/>
      
      {/*Tooltip acts as a hover that displays the name */}
      </Tooltip>
      <p className="textP">{text}</p>
      <h6 className="timeStamp">{time}</h6>

    </div>
  </>)
}

function Logout(){
  auth.signOut();
}



//export default ChatApp;
export default RightNav;












