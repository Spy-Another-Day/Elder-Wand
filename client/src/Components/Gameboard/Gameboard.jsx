import react, {useEffect, useState, userRef, useContext} from 'react';
import Game from './Game.jsx'
import axios from 'axios';
import { SocketContext } from '../../socket.js';

import { useParams } from 'react-router-dom'
export default function Gameboard() {
  const socket = useContext(SocketContext);
  const params = useParams();
  //maybe sent from upper component
  let topic = 'Technology'
  //fix:running twice
  useEffect(()=> {

    axios.get(`${import.meta.env.VITE_SERVER_URL}/initGame/${topic}`)
    .then(({data}) => {
      data.roomID = params.roomID;
      //remember to send room id/name as well
      //data.roomId= '...'

      socket.emit('initialGameState', data)

    })
    .catch(err=>console.log(err))

  },[])

  return (<>
    <Game/>
  </>)

}