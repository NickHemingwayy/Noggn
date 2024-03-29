import React, { Component ,useState,useEffect } from 'react';
import { Flowpoint, Flowspace } from 'flowpoints';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
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
import Popover from '@material-ui/core/Popover';
import ImageIcon from '@material-ui/icons/Image';
import HelpIcon from '@material-ui/icons/Help';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import { ChangeHistoryOutlined, CloseOutlined } from '@material-ui/icons';
import fire from './config/fire.js';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import * as firebase from 'firebase';
import './css/ideaBoard.css'
import icon from './imgs/Icon.png';
import { render } from '@testing-library/react';

const useStyles = makeStyles((theme) => ({


  root:{
    
    },
  paper:{
   width: '100%',
   boxShadow: '0 0 12px rgb(45, 46, 78, 0.23)',
  },
  content:{
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px',
    width: '300px'
  },
  elevation8:{
    
  }


}));

const firestore = fire.firestore();
const auth = fire.auth();
const currUser = fire.auth().currentUser;

let editIsClicked = false;
let newConnectIsClicked = false;
let addUrlIsClicked = false;
let deleteIsClicked = false;
let addImgIsClicked = false;

let rmCtnIsClicked = false;
let colorChangeIsClicked = false;
let connectionNodes = [];
let updatedConnections = [];
let file;
let imgUrl;
let imgHeight = 0;
let nodePos = []
var htmlToImage = require('html-to-image');
var linkTheme = "#2D2E4E";

function IdeaBoard(ideaRoom) {
  let savedPoints = [];
  const [points, setPoints] = useState(savedPoints);
  const pointsRef = fire.firestore().collection(ideaRoom.room);
  const [cancelShow,toggleCancel] = useState(false);
  const [pointPos,setPointPos] = useState([0,0]);
 
  var diagramRef = null;

  let fileBase = /[^/]*$/.exec(ideaRoom.room)[0];

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
 

function updateConnection(ctnNodes){
  let node1 = ctnNodes[0];
  let node2 = ctnNodes[1];
  (async () => {
    await pointsRef.doc(node1).update({"outputs": firebase.firestore.FieldValue.arrayRemove(node2)});
    await pointsRef.doc(node1).update({'inputs': firebase.firestore.FieldValue.arrayRemove(node2)});
    await pointsRef.doc(node2).update({'outputs': firebase.firestore.FieldValue.arrayRemove(node1)});
    await pointsRef.doc(node2).update({'inputs': firebase.firestore.FieldValue.arrayRemove(node1)});
})()


}

let fileUpload = document.getElementById("fileImg");
if(fileUpload){
  fileUpload.addEventListener('change', function(e){
    file = e.target.files[0];
  });  
  
}
const delay = ms => new Promise(res => setTimeout(res, ms));

function uploadImg(node){

      let storageRef = fire.storage().ref(fileBase + '/' + node);
      storageRef.put(file);

      pointsRef.doc(node).update({img:true});

      (async () => {
        let storageRef = fire.storage().ref(fileBase + '/' + node);
        await storageRef.put(file);
        await delay(10000);
        await pointsRef.doc(node).update({img:true});
       
    })()

      
} 



function deleteNode(node){
  
  let outputs;
  let inputs;
  let updateNode;
  let origIns;
  let newIns;
  let origOuts;
  let newOuts;
  pointsRef.onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if(doc.id == node){
        outputs = doc.data().outputs;
        inputs = doc.data().inputs;
        if(outputs != null){
          let i; 
          for(i=0; i< outputs.length; i++){
            updateNode = outputs[i];

  pointsRef.doc(node).get();
 


            pointsRef.onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if(doc.id == updateNode){
                  origIns = doc.data().inputs;
                  for(let j=0;j<origIns.length;j++){
                    if(origIns[j] == node){
                      newIns = origIns.splice(0,j);
                      pointsRef.doc(updateNode).update({inputs:newIns});

                    }
                  }
                }
              });
            });
            
          }
        }
        if(inputs != null){
          let i;
          for(i=0; i< inputs.length; i++){
            updateNode = inputs[i];

            pointsRef.onSnapshot((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if(doc.id == updateNode){
                  origOuts = doc.data().outputs;
                  for(let j=0;j<origOuts.length;j++){
                    if(origOuts[j] == node){
                      newOuts = origOuts.splice(0,j);
                      pointsRef.doc(updateNode).update({outputs:newOuts});
   
                    }
                  }
                }
              });
            });
            
          }
        }

      }
    });
  });
  //console.log(pointsRef.doc(node).get());
  pointsRef.doc(node).delete();
}


function changeColor(node, color){
  
  if (color != null){
      pointsRef.doc(node).update({theme:color});
  }
  
}

function nodeFunctions(node){
  
  if(editIsClicked){
    changeText(node,prompt('Enter Node Text'));
    resetBtns();
    updateNodePos();
  }else if(newConnectIsClicked){
    if(connectionNodes.length < 2){
      connectionNodes.push(node);
    }
    if(connectionNodes.length == 2 && connectionNodes[0] != connectionNodes[1]){
      createConnection(connectionNodes);
      connectionNodes = [];
      resetBtns();
      updateNodePos();
    }
  }else if(deleteIsClicked){
    deleteNode(node);
    resetBtns();
  }
  else if(addUrlIsClicked){
    addURL(node,prompt('Enter URL starting with https://'));
    resetBtns();
    updateNodePos();
  }else if(rmCtnIsClicked){
    if(updatedConnections.length < 2){
      updatedConnections.push(node);
    }
    if(updatedConnections.length == 2 && updatedConnections[0] != updatedConnections[1]){
      updateConnection(updatedConnections);
      updatedConnections = [];
      resetBtns();
      updateNodePos();
    }
  }
  else if(colorChangeIsClicked){
    changeColor(node, prompt('Type the color you want or enter a custom Hexcode'));
    resetBtns();
    updateNodePos();
  }
  else if(addImgIsClicked){
    uploadImg(node);
    alert("Your image is being uploaded. Please wait a moment.");
    resetBtns();
    updateNodePos();
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
  function handleClick(e) {
    e.preventDefault();
    if(link.link.length != 0){
      
    window.open(link.link, "_blank")

    }
    
  }

  return (
    <Link href={link.link} onClick={handleClick}>
      {link.link}
    </Link>
  );
}



function nodeImg(node,img){
  let test;
  if(img){
 
     fire.storage().ref(fileBase + '/' + node).getDownloadURL().then(function(url) {
        test = url;
        document.getElementById(node).src = test;
        document.getElementById(node).addEventListener("load", function () {
          imgHeight = this.height;
          pointsRef.doc(node).update({imgHeight:imgHeight});
          
          });

      }).catch(function(error) {
      
      });
  }else{
    imgHeight = 0;
  }

}
function updateNodePos(){
  for(let i=0;i<nodePos.length;i++){

      pointsRef.doc(nodePos[i].node).update({x:nodePos[i].x});
      pointsRef.doc(nodePos[i].node).update({y:nodePos[i].y});
    
  }
}



  function getPoints(){
    
    
    pointsRef.onSnapshot((querySnapshot) => {
      savedPoints = [];
      let imgHt;
      nodePos = [];
      querySnapshot.forEach((doc) => {   
        let hasImg = null;
        if(doc.data().img == true){
          hasImg = true;
          imgHeight = doc.data().imgHeight;
        } else{
          imgHeight = 0;
        }
        nodeImg(doc.data().key,doc.data().img);
        nodePos.push({node:doc.data().key,x:doc.data().x,y:doc.data().y});
        savedPoints.push([
          <Flowpoint key= {doc.data().key} 
          onDrag={ (position) => {
          for(let i=0;i<nodePos.length;i++){
            //console.log('Drag', nodePos[i]); 
            if(nodePos[i].node == doc.data().key){
              
              nodePos[i].x = position.x;
              nodePos[i].y = position.y;
            }
          }} } 
          startPosition={{ x:doc.data().x, y:doc.data().y}}  style={{height:Math.max(50, Math.ceil((doc.data().value.length + doc.data().url.length) / 20) * 30) + imgHeight}} theme={doc.data().theme} onClick={() => nodeFunctions(doc.data().key)}  outputs={doc.data().outputs}><div style={{display:'table', width:'100%', height:'100%'}}>
          
          <div style={{display:'table-cell', verticalAlign:'middle', textAlign:'left', paddingLeft:5, paddingRight:2}}>
            
              {linkify(doc.data().value)}
              
            
            <br></br>
            <ActionLink link={doc.data().url}/>
            
            {hasImg ?  <img src="" id={doc.data().key} style={{width:'120px'}}/>: null}
            
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
        x:200,
        y:200,
        url:'',
        theme: '#5855FC',
        img: false

  })
  updateNodePos();
    }

    function createConnection(connectionNodes){
      (async () => {
        await pointsRef.doc(connectionNodes[0]).update({outputs:firebase.firestore.FieldValue.arrayUnion(connectionNodes[1])});
        await pointsRef.doc(connectionNodes[1]).update({inputs:firebase.firestore.FieldValue.arrayUnion(connectionNodes[0])});
    })()
      
    }


  function resetBtns(){
    editIsClicked = false;
    newConnectIsClicked = false;
    addUrlIsClicked = false;
    deleteIsClicked = false;
    addImgIsClicked = false;
    rmCtnIsClicked = false;
    document.getElementById("editBtn").style.cssText = "color: 'secondary'"
    document.getElementById("connectionBtn").style.cssText = "color: 'secondary'"
    document.getElementById("linkBtn").style.cssText = "color: 'secondary'"
    document.getElementById("rmCtnBtn").style.cssText = "color: 'secondary'"
    document.getElementById("imgBtn").style.cssText = "color: 'secondary'"
    colorChangeIsClicked = false;
    document.getElementById("editBtn").style.cssText = "color: 'secondary'"
    document.getElementById("connectionBtn").style.cssText = "color: 'secondary'"
    document.getElementById("linkBtn").style.cssText = "color: 'secondary'"
    document.getElementById("colorBtn").style.cssText = "color: 'secondary'"

    document.getElementById("deleteBtn").style.cssText = "color: 'secondary'"
    document.getElementById("saveBtn").style.cssText = "color: 'secondary'"
    toggleCancel(false);
  }



  //same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState

  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const profileOpen = Boolean(anchorEl);
  const id = profileOpen ? 'simple-popover' : undefined;

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };
    
  const theme = useTheme();
  const classes = useStyles();


      return (
          <>
          
        <div class="optionsContainer">
        <div class="nodeOptions">
        <Tooltip title="Add Node"><IconButton component="span" color="primary" onClick={pushPointDB}><AddCircleIcon /></IconButton></Tooltip>
        
        <Tooltip title="Add Connection"><IconButton component="span" color="primary"id = 'connectionBtn' onClick={function(){resetBtns(); newConnectIsClicked = true;  toggleCancel(true); document.getElementById("connectionBtn").style.cssText = "color: #2D2E4E"}}><AccountTreeIcon /></IconButton></Tooltip>
        </div>
        <div class="nodeOptions">
        <Tooltip title="Change Node Text"><IconButton component="span" color="primary"id = 'editBtn' onClick={function(){resetBtns() ; editIsClicked = true; toggleCancel(true); document.getElementById("editBtn").style.cssText = "color: #2D2E4E"} }><TextFieldsIcon /></IconButton></Tooltip>
        
        <Tooltip title="Change Node Colour"><IconButton component="span" color="primary" id='colorBtn' onClick={function(){resetBtns() ; colorChangeIsClicked = true; toggleCancel(true); document.getElementById("colorBtn").style.cssText = "color: #2D2E4E"}} ><ColorLensIcon/></IconButton></Tooltip>      

        <Tooltip title="Add URL"><IconButton component="span" color="primary"id = 'linkBtn' onClick={function(){resetBtns(); addUrlIsClicked = true; toggleCancel(true); document.getElementById("linkBtn").style.cssText = "color: #2D2E4E"}}><LinkIcon/></IconButton></Tooltip>

        <Tooltip title="Delete Connection"><IconButton component="span" color="primary"id = 'rmCtnBtn' onClick={function(){resetBtns(); rmCtnIsClicked = true; toggleCancel(true); document.getElementById("rmCtnBtn").style.cssText = "color: #2D2E4E"}}><RemoveCircleIcon/></IconButton></Tooltip>

        <Tooltip title="Add Image"><IconButton component="span" color="primary"id = 'imgBtn' onClick={function(){handleClick();resetBtns(); addImgIsClicked = true; toggleCancel(true); document.getElementById("imgBtn").style.cssText = "color: #2D2E4E"}}><ImageIcon/><input ref={hiddenFileInput} type="file" id="fileImg" style={{display: 'none'}}></input></IconButton></Tooltip>
        
        </div>
        <div class="nodeOptions">
        <Tooltip title="Save Diagram"><IconButton component="span" color="primary"id = 'saveBtn' onClick={() => {
                    htmlToImage.toPng(diagramRef).then(function (dataUrl) {
                    var img = new Image();
                    img.src = dataUrl;
                    var link = document.createElement('a');
                    link.download = 'noggn_mindmap.png';
                    link.href = dataUrl;
                    link.click();
                  });

        }}><SaveAltIcon/></IconButton></Tooltip>


        <Tooltip title="Delete Node"><IconButton component="span" color="primary"id = 'deleteBtn' onClick={function(){resetBtns(); deleteIsClicked = true; toggleCancel(true); document.getElementById("deleteBtn").style.cssText = "color: #2D2E4E"}}><DeleteIcon/></IconButton></Tooltip>
        
        </div>
        <div class="cancelBtn">
          {cancelShow ? <Fab size="small" style={{ backgroundColor: 'red' , color:"white"}} onClick={resetBtns} >
            <CancelIcon />
          </Fab> : null}
        </div>
      </div>
      
      
        <Flowspace 
          theme="#2D2E4E"
          variant="filled"
          background="#EEF1FA"
          style={{ width:'90vw', height:'80vh'}}
          connectionSize = {2}
          arrowStart={false}
          arrowEnd={true}
          getDiagramRef={ref => {diagramRef = ref}}
          selected="point_a"
          selectedLine={{ a:"point_a", b:"point_b" }}
          onLineClick={(key_a, key_b, e) => {
          }}
          onClick={e => {}}
          >
            {points}
        </Flowspace>
        <div className ="help">
          <IconButton onClick={handleProfileMenu}><HelpIcon fontSize ="large" color="primary"  /></IconButton>
          <Popover
                id={id}
                className = {classes.paper}
                open={profileOpen}
                anchorEl={anchorEl}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <div className ={classes.content}>
                <p> <span style={{color: '2D2E4E', fontSize: '1.2em'}}><b>Quick Answers</b> </span></p>
                <p><span style={{color: '#5855FC'}}>How do I create a connection?</span></p>
                <p><span style={{fontSize: '0.9em'}}>Click the <AccountTreeIcon color="primary" className ={classes.icon}/> icon, then click the node you want the connection to start at and then click the node you want to connect it to.</span></p>
                <p><span style={{color: '#5855FC'}}>How do I delete a connection?</span></p>
                <p><span style={{fontSize: '0.9em'}}>Click the <RemoveCircleIcon color='primary' className ={classes.icon}/> icon, then click the nodes you want to delete the connection from.</span></p>
                <p><span style={{color: '#5855FC'}}>What is a hexcode?</span></p>
                <p><span style={{fontSize: '0.9em'}}>A hexcode is a combination of letters and numbers that pertains to a certain color. Visit <a href='https://coolors.co/'> Coolors</a> to find and create beautiful palettes that you can use for your mind map!</span></p>
                </div>
                
                </Popover>
          </div>
</>

      );
      // Adds new point to nodes state
  }


  export default IdeaBoard;
  