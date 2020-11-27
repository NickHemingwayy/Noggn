import React, { Component ,useState } from 'react';
import { Flowpoint, Flowspace } from 'flowpoints';
import Button from '@material-ui/core/Button';

let count = 0;




function IdeaBoard() {
  let points = [<Flowpoint key="point_a" >Hello world</Flowpoint>,<Flowpoint key="point_b" outputs={["point_a"]}>I am point b</Flowpoint>];

  const [nodes, setNodes] = useState(points);
      
      return (
          <>
        
        <button onClick={newPoint}>New Node</button> {/*Triggers newPoint Function*/}
        <Flowspace >
            {nodes}
        </Flowspace>
</>

      );
      
      // Adds new point to nodes state
    function newPoint(){
      count = nodes.length + 1;
        //points.push(<Flowpoint key={"point_"+count} outputs={["point_a"]}>New Node</Flowpoint>);
      setNodes([...nodes,<Flowpoint key={"point_"+ count} outputs={["point_a"]}>New Node</Flowpoint>]);
      console.log(nodes.length);
    }
  }


  export default IdeaBoard;
  