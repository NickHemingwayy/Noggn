import React, { useEffect, useRef, useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import clsx from 'clsx';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

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
import ImageIcon from '@material-ui/icons/Image';
import HelpIcon from '@material-ui/icons/Help';
import { Delete } from '@material-ui/icons';

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      boxShadow: 'none',
      
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    paragraph:{
      fontSize: '0.9em',
      flexDirection: 'row'
    },
    p:{
      verticalAlign: 'middle'
    }
  }));

export default function HelpCentre(){

  
      const [expanded, setExpanded] = React.useState(false);

      const handleAccordianChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };
      const classes = useStyles();
    const theme = useTheme();

      return(
        <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')} className={classes.root}>

        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          
        >

          <Typography >Dashboard</Typography>

        </AccordionSummary>

        <AccordionDetails >
          <div className={classes.paragraph}>
          <p>
            Your dashboard will always be displayed whenever you log into Noggn, whenever you refresh the page, or whenever you click the <span style={{ color: '#5855FC' }}><b>HOME</b></span> button. 
            This is the page where all of your active teams will be displayed. Clicking the <span style={{ color: '#5855FC' }}><b>NAME</b></span> of any one of your active teams will take you to the your mind map canvas for that specific team.
            </p>
            <p>
            Here, you will also be able to create a new team by clicking the <span style={{ color: '#5855FC' }}><b>CREATE TEAM</b></span> button. 

          </p>
          </div>
        </AccordionDetails>

      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')} className={classes.root}>

        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography >
            Teams and Team Creation
          </Typography>

        </AccordionSummary>

        <AccordionDetails >
        <div className= {classes.paragraph}>
          <p >
          Noggn is designed specifically for teams, so you must always create a team to gain access to the mind map feature. Each time you create will have its own mind map canvas and chat app. 
          </p>
          <p >
          Here are the simple steps to creating a team. 
</p>
<p >
        <b>1</b> - Click <span style={{ color: '#5855FC' }}><b>CREATE TEAM</b></span> on the Dashboard page. 
        </p>
        <p >
        <b>2</b> - Write whatever name you want your team to be called.
        </p><p>
        <b>3</b> - If you have team members you want to include, write their emails and separate each email by commas. For example: test1@gmail.com, test2@gmail.com, test3@gmail.com.
        </p>
        <p>
        <b>4 </b>- Click <span style={{ color: '#5855FC' }}><b>CREATE TEAM</b></span> at the bottom of the form and close the form. Great job, you did it!
</p> <p>
        After creating a team, you’ll see the name appear under <b>Active Teams</b>. Click it and it will take you to the Team Page for that specific team.

          </p>
          </div>
        </AccordionDetails>

      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')} className={classes.root}>

        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
          
        >
          
          <Typography >
            Chat Feature
          </Typography>

        </AccordionSummary>

        <AccordionDetails >
          <div className ={classes.paragraph}>
          <p>
            One of Noggn’s best features is the Chap App. This allows teams to communicate with each other in real time - right on the app! 
          </p>
          <p>
            The chat can be found to the <b>left</b> of the mind map canvas. You’ll see a welcome message from our Chat Assistant! Your messages will be displayed in the chat app and you’ll be able to see what your team members say. 
          </p>
          <p>
          <span style={{ color: '#5855FC' }}><b>TIP:</b></span> If you don’t have any team members, you can use this as a note section!
          </p>
          <p>
            You can close the chat at any time by clicking the arrow on the top left. When it is closed, you’ll see your team members icons pop up as they send messages. Simply hover over the icons to see what they have said. To open it back up, click the arrow at the top left!
          </p>
        </div>
        </AccordionDetails>

      </Accordion>

      <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')} className={classes.root}>

        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >

          <Typography >Mind Map Creation</Typography>

        </AccordionSummary>

        <AccordionDetails>
          <div className={classes.paragraph}>
          <p>
            Everything you need to create an amazing mind map is in the tool bar. Here's a quick run down of what each button does
          </p> 
          <p>
            <AddCircleIcon color='primary'className ={classes.icon}/> - Add a new node
            </p>
            <p>
        <AccountTreeIcon color="primary" className ={classes.icon}/> - Add a connection between nodes. Click this button, then click the node you want to start at and then click the node you want the link to point to. 
        </p><p>
        <TextFieldsIcon color="primary" className ={classes.icon}/> - Change the text in the node. Click this button, then click the node that you want to change the text of. Write the text in the popup. 
        </p>
        <p>
       <ColorLensIcon color='primary' className ={classes.icon}/> - Change the color of the node. Click this button, then enter the color you want to change it to, then click the node that you want to change the color of. 
        </p>
        <p>
        <LinkIcon color='primary' className ={classes.icon}/> - Add a hyperlink to a node. Click this button, then click the node that you want to add a link to. Input the https link into the popup.
        </p>
        <p>
        <SaveAltIcon color='primary' className ={classes.icon}/> - Save the diagram to your desktop. Click this button then save it to your desktop.
       </p>
       <p>
        <RemoveCircleIcon color='primary' className ={classes.icon}/> - Delete a connection. Click this button then click the node you want to delete. 
          </p>
       <p>
        <DeleteIcon color='primary' className ={classes.icon}/> - Delete a node. Click this button then click both nodes that are connected by the connection you want to delete. 
          </p>
          <p>
          <span style={{ color: '#5855FC' }}><b>TIP:</b></span> Noggn’s canvas is unlimited. This means you can create multiple mind maps. All of your nodes don’t have to be attached to each other. Get creative with it!
          </p>
          </div>

        </AccordionDetails>

      </Accordion>

    </div>



      );

}