import React, { Component ,useState,useEffect } from 'react';
import { Flowpoint, Flowspace } from 'flowpoints';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import DeleteIcon from '@material-ui/icons/Delete';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import fire from './config/fire.js';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import * as firebase from 'firebase';
import './ideaBoard.css'
import icon from './Icon.png';
const firestore = fire.firestore();
const auth = fire.auth();
const currUser = fire.auth().currentUser;


let editIsClicked = false;
let newConnectIsClicked = false;
let addUrlIsClicked = false;
let deleteIsClicked = false;
let connectionNodes = [];

var htmlToImage = require('html-to-image');

function IdeaBoard(ideaRoom) {
  let savedPoints = [];
  const [points, setPoints] = useState(savedPoints);
  const pointsRef = fire.firestore().collection(ideaRoom.room);
  const [cancelShow,toggleCancel] = useState(false);
  const [pointPos,setPointPos] = useState([0,0]);

  var diagramRef = null;

  function changeText(node,name) {
    
    if (name != null){
      pointsRef.doc(node).update({value:name});
  }
}

function addURL(node,url){
  if(url != null){
    pointsRef.doc(node).update({url:url});
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
  else if(addUrlIsClicked){
    addURL(node,prompt('Enter URL'));
    resetBtns();
  }
}

function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}
function ActionLink(link) {
  console.log(link.link);
  function handleClick(e) {
    e.preventDefault();
    if(link.link.length != 0){
      
    window.open(link.link, "_blank")

    }
    
  }

  return (
    <a href={link.link} onClick={handleClick}>
      {link.link}
    </a>
  );
}


  function getPoints(){
    
    pointsRef.onSnapshot((querySnapshot) => {
      savedPoints = [];
      querySnapshot.forEach((doc) => {
        savedPoints.push([
          <Flowpoint key= {doc.data().key}  startPosition={{ x:Math.floor(Math.random() * 800) + 200, y:Math.floor(Math.random() * 550) + 100 }}  style={{height:Math.max(50, Math.ceil((doc.data().value.length + doc.data().url.length) / 20) * 30)}} theme='#5855FC' onClick={() => nodeFunctions(doc.data().key)}  outputs={doc.data().outputs}><div style={{display:'table', width:'100%', height:'100%'}}>
          
          <div style={{display:'table-cell', verticalAlign:'middle', textAlign:'center', paddingLeft:2, paddingRight:2}}>
            
              {linkify(doc.data().value)}
              
            
            <br></br>
            <ActionLink link={doc.data().url}/>
          </div>
        </div></Flowpoint>
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
        url:''

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
    addUrlIsClicked = false;
    deleteIsClicked = false;
    document.getElementById("editBtn").style.cssText = "color: color='secondary'"
    document.getElementById("connectionBtn").style.cssText = "color: 'secondary'"
    document.getElementById("linkBtn").style.cssText = "color: 'secondary'"
    document.getElementById("deleteBtn").style.cssText = "color: 'secondary'"
    document.getElementById("saveBtn").style.cssText = "color: 'secondary'"
    toggleCancel(false);
  }

  function savePositions(){
  
   
  }
  //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState




      return (
          <>
          
      <div class="optionsContainer">
        <div class="nodeOptions">
        <Tooltip title="Add Node"><IconButton component="span" color="secondary" onClick={pushPointDB}><AddCircleIcon /></IconButton></Tooltip>
        <Tooltip title="Add Connection"><IconButton component="span" color="secondary"id = 'connectionBtn' onClick={function(){resetBtns(); newConnectIsClicked = true;  toggleCancel(true); document.getElementById("connectionBtn").style.cssText = "color: grey"}}><AccountTreeIcon /></IconButton></Tooltip>
        <Tooltip title="Change Node Text"><IconButton component="span" color="secondary"id = 'editBtn' onClick={function(){resetBtns() ; editIsClicked = true; toggleCancel(true); document.getElementById("editBtn").style.cssText = "color: grey"} }><TextFieldsIcon /></IconButton></Tooltip>
        <Tooltip title="Change Node Colour"><IconButton component="span" color="secondary" onClick={savePositions}><ColorLensIcon/></IconButton></Tooltip>
        <Tooltip title="Add Link"><IconButton component="span" color="secondary"id = 'linkBtn' onClick={function(){resetBtns(); addUrlIsClicked = true; toggleCancel(true); document.getElementById("linkBtn").style.cssText = "color: grey"}}><LinkIcon/></IconButton></Tooltip>
        <Tooltip title="Save Diagram"><IconButton component="span" color="secondary"id = 'saveBtn' onClick={() => {
                    htmlToImage.toPng(diagramRef).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    var link = document.createElement('a');
                    link.download = 'diagram.png';
                    link.href = dataUrl;
                    link.click();
                  });

        }}><SaveAltIcon/></IconButton></Tooltip>
        <Tooltip title="Delete Node"><IconButton component="span" color="secondary"id = 'deleteBtn' onClick={function(){resetBtns(); deleteIsClicked = true; toggleCancel(true); document.getElementById("deleteBtn").style.cssText = "color: grey"}}><DeleteIcon/></IconButton></Tooltip>
        
        </div>
        <div class="cancelBtn">
          {cancelShow ? <Fab size="small" style={{ backgroundColor: 'red' , color:"white"}} onClick={resetBtns} >
            <CancelIcon />
          </Fab> : null}
        </div>
      </div>
      
      
        <Flowspace 
          theme="indigo"
          variant="filled"
          background="#F1F2F8"
          style={{ width:'90vw', height:'80vh'}}
          connectionSize = {4}
          arrowStart={false}
          arrowEnd={true}
          getDiagramRef={ref => {diagramRef = ref}}
          selected="point_a"
          selectedLine={{ a:"point_a", b:"point_b" }}
          onLineClick={(key_a, key_b, e) => {
            console.log('yes')
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
  