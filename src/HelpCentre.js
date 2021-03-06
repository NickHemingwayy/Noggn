import React, { useEffect, useRef, useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import clsx from 'clsx';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import GitHubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      boxShadow: 'none',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
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

        <AccordionDetails>

          <Typography>
            Your dashboard will always be displayed whenever you log into Noggn, whenever you refresh the page, or whenever you click the ‘home’ button. 
            This is the page where all of your active teams will be displayed. Clicking the ‘NAME’ of any one of your active teams will take you to the your mind map canvas for that specific team.
        
            Here, you will also be able to create a new team by clicking the ‘CREATE TEAM’ button. 

          </Typography>

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

        <AccordionDetails>

          <Typography>
          Since Noggn is designed specifically for teams, you must always create a team to gain access to the mind map feature. Each time you create will have its own mind map canvas and chat app. 

        Here are the simple steps to creating a team. 

        1- Click ‘CREATE TEAM’ on the Dashboard page. 
        2- Write whatever name you want your team to be called.
        3 (optional) - If you have team members you want to include, write their emails and separate each email by commas. For example: test1@gmail.com, test2@gmail.com, test3@gmail.com.
        4- Click ‘CREATE TEAM’ at the bottom of the form and close the form. Great job, you did it!

        After creating a team, you’ll see the name appear under ‘Active Teams’. Click it and it will take you to the Team Page for that specific team.

          </Typography>

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

        <AccordionDetails>

          <Typography>
            One of Noggn’s best features is the Chap App. This allows teams to communicate with each other in real time - right on the app! 

            The chat can be found to the right of the mind map canvas. You’ll see a welcome message from our Chat Assistant! Your messages will be displayed in the chat app and you’ll be able to see what your team members say. 

            Tip: If you don’t have any team members, you can use this as a note section!

            You can close the chat at any time by clicking the arrow on the top left. When it is closed, you’ll see your team members icons pop up as they send messages. Simply hover over the icons to see what they have said. To open it back up, click the arrow at the top left!

          </Typography>

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

          <Typography>
          Mind maps are visual graphs or maps that help visualize the idea creation process. In Noggn’s case they are individual nodes that are connected by lines. 

            After you’ve selected a team you’ll see the main canvas for your mind map and one node that has already been created. You’ll also see a toolbar at the top that has all of the tools you need. Simply hover over each tool to see what it does. 

            PLUS - Add a new node
        CONNECTION - Add a connection between nodes. Click this button, then click the node you want to start at and then click the node you want the link to point to. 
        TEXT - Change the text in the node. Click this button, then click the node that you want to change the text of. Write the text in the popup. 
        COLOR - Change the color of the node. Click this button, then click the color you want to change it to, then click the node that you want to change the color of. 
        LINK - Add a hyperlink to a node. Click this button, then click the node that you want to add a link to. Input the https link into the popup. You must include the https:// with this link.
        SAVE - Save the diagram to your desktop. Click this button then save it to your desktop under whatever name you want.
        DELETE - Delete a node. Click this button then click the node you want to delete. 

        Tip: Noggn’s canvas is unlimited. This means you can create multiple mind maps. All of your nodes don’t have to be attached to each other. Get creative with it!
          </Typography>

        </AccordionDetails>

      </Accordion>

    </div>



      );

}