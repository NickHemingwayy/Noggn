import React, { useEffect, useRef, useState } from 'react';
import fire from './config/fire.js';
import TextField from '@material-ui/core/TextField';
import './chatApp.css';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


const firestore = fire.firestore();
const auth = fire.auth();
const analytics = fire.analytics();

//
function RightNav(){

  let navWidth = '';
  let toggleInd = '<'
  const [toggle, setState] = useState(true);
  console.log(toggle);


  if(toggle == false){
    navWidth = '5%'
    toggleInd = '<'
  }else{
    navWidth = '25%'
    toggleInd = '>'
  }

  let navStyle = {
    'width': navWidth
  }
  
  return(
    <div style = {navStyle} className="rightNav">
      <button onClick = {() => setState(!toggle)} className="toggle">{toggleInd}</button>
      {toggle ? <ChatApp/> : null}
    </div>
  )
}




function ChatApp() {
  
  const [user] = useAuthState(auth);


  return (

    <div className="chatApp">
      <header>
        <button onClick = {Logout} className="logoutBtn">Logout</button>
      </header>
      <section>
        {<ChatRoom />}
      </section>
      
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

  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

  <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="New Message..." />
    

      <button type="submit" disabled={!formValue} className="submitBtn">✉</button>

    </form>
  </>)
}

// Is used directly by the ChatRoom function to return the message and verify who sent it
function ChatMessage(props) {
  const { text, uid, photoURL, user } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  return (<>
    <div className={`message ${messageClass}`}>
      {/* the name of the user that sent the message */}
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} title={user}/>
      <p>{text}</p>
    </div>
  </>)
}

function Logout(){
  auth.signOut();
}



//export default ChatApp;
export default RightNav;












