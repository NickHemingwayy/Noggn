import React, { Component ,useState,useEffect } from 'react';
import { Flowpoint, Flowspace } from 'flowpoints';
import Button from '@material-ui/core/Button';
import fire from './config/fire.js';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import * as firebase from 'firebase';

const firestore = fire.firestore();
const auth = fire.auth();
const currUser = fire.auth().currentUser;


let editIsClicked = false;
let newConnectIsClicked = false;
let deleteIsClicked = false;
let connectionNodes = [];

function IdeaBoard(ideaRoom) {
  let savedPoints = [];
  const [points, setPoints] = useState(savedPoints);
  const pointsRef = fire.firestore().collection(ideaRoom.room);
  const [cancelShow,toggleCancel] = useState(false)
  function changeText(node,name) {
    
    if (name != null){
      pointsRef.doc(node).update({value:name});
  }
}

function deleteNode(node){
  pointsRef.doc(node).get()
 

  pointsRef.doc(node).delete();
}


function nodeFunctions(node){
  if(editIsClicked){
    changeText(node,prompt('Enter Node Text'));
    resetBtns();
  }else if(newConnectIsClicked){
    if(connectionNodes.length < 2){
      connectionNodes.push(node);
    }
    if(connectionNodes.length == 2 && connectionNodes[0] != connectionNodes[1]){
      createConnection(connectionNodes);
      connectionNodes = [];
      resetBtns();
    }
    console.log(connectionNodes);
  }else if(deleteIsClicked){
    deleteNode(node);
    resetBtns();
  }
}




  function getPoints(){
    pointsRef.onSnapshot((querySnapshot) => {
      savedPoints = [];
      querySnapshot.forEach((doc) => {
        console.log("this room:" + ideaRoom.room)
        savedPoints.push([
          <Flowpoint key= {doc.data().key} onClick={() => nodeFunctions(doc.data().key)} outputs={doc.data().outputs}>{doc.data().value}</Flowpoint>
        ]);
      });
      setPoints(savedPoints);
    });
    
  }

  useEffect(() => {
    getPoints();
  }, []);

 
    function pushPointDB(){
      //let nodeNum = points.length + 1;
      var newNodeRef = pointsRef.doc();
      newNodeRef.set ({ 
        key: newNodeRef.id,
        value: 'New Node',
        x:20,
        y:20,

  })
  getPoints();
    }

    function createConnection(connectionNodes){
      pointsRef.doc(connectionNodes[0]).update({outputs:firebase.firestore.FieldValue.arrayUnion(connectionNodes[1])});
      pointsRef.doc(connectionNodes[1]).update({inputs:firebase.firestore.FieldValue.arrayUnion(connectionNodes[0])});
      getPoints();
    }

 
  function resetBtns(){
    editIsClicked = false;
    newConnectIsClicked = false;
    deleteIsClicked = false;
    document.getElementById("editBtn").style.cssText = "background-color: light-grey; color: black"
    document.getElementById("connectionBtn").style.cssText = "background-color: light-grey; color: black"
    document.getElementById("deleteBtn").style.cssText = "background-color: light-grey; color: black"
    toggleCancel(false);
  }
  //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState




      return (
          <>
        
      <button onClick={pushPointDB}>New Node</button> {/*Triggers newPoint Function*/}
      <button id = 'editBtn' onClick={function(){resetBtns() ;editIsClicked = true; document.getElementById("editBtn").style.cssText = "background-color: #2D2E4E; color: white" ; toggleCancel(true)} }>Edit Node Name</button> {/*Triggers newPoint Function*/}
      <button id = 'connectionBtn' onClick={function(){resetBtns(); newConnectIsClicked = true; document.getElementById("connectionBtn").style.cssText = "background-color: #2D2E4E; color: white" ; toggleCancel(true)}}>New Connection</button> {/*Triggers newPoint Function*/}
      <button id = 'deleteBtn' onClick={function(){resetBtns();deleteIsClicked = true; document.getElementById("deleteBtn").style.cssText = "background-color: #2D2E4E; color: white" ; toggleCancel(true)}}>Delete Node</button> {/*Triggers newPoint Function*/}
      {cancelShow ? <button onClick={resetBtns}>Cancel</button> : null}
        <Flowspace 
          theme="indigo"
          variant="outlined"
          background="white"
          style={{ width:'90vw', height:'85vh' }}
          connectionSize = {4}
          arrowStart={false}
          arrowEnd={true}
          selected="point_a"
          selectedLine={{ a:"point_a", b:"point_b" }}
          onLineClick={(key_a, key_b, e) => {
            console.log('Click connection ' + key_a + ' -> ' + key_b)
          }}
          onClick={e => {}}
          >
            {points}
        </Flowspace>
</>

      );
      // Adds new point to nodes state
  }


  export default IdeaBoard;
  