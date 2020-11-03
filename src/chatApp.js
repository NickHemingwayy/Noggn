import React, { useRef, useState } from 'react';
import fire from './config/fire.js';
import TextField from '@material-ui/core/TextField';
import './App.css';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


const firestore = fire.firestore();
const auth = fire.auth();
const analytics = fire.analytics();

function ChatApp() {
  
  const [user] = useAuthState(auth);
  

  return (
    <div className="chatApp">
      <button onClick = {Logout}>Logout</button>
      <header>
        <h1>Chat App💬 {user.email}</h1>

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


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    //TODO: Add name into message collection
   // const name = GetName;

    await messagesRef.add({
      text: formValue,
      createdAt: + new Date(),
      uid,
      photoURL,
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

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

// Is used directly by the ChatRoom function to return the message and verify who sent it
function ChatMessage(props) {
  const { text, uid, photoURL, name } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  

  return (<>
    <div className={`message ${messageClass}`}>
      {/* the name of the user that sent the message */}
      <p>{uid}</p>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

//Gets the user's name that sent the message

/*function GetName(uid){
  const [user] = useAuthState(auth);
  const nameRef = firestore.collection('Users');
  const nameQuery = nameRef.where("uid", "==", uid);
  //const [name] = nameQuery.get();
  nameRef.useCollectionData(nameQuery)
  return nameQuery['name'];
} */

function Logout(){
  auth.signOut();
}


export default ChatApp;












