import react, {useEffect, useState, userRef, useContext} from 'react';
import Game from './Game.jsx'
import axios from 'axios';
import { SocketContext } from '../../socket.js';
import { useParams } from "react-router-dom";
export default function Gameboard() {
  const socket = useContext(SocketContext);
  //maybe sent from upper component
  let topic = 'general'
  //fix:running twice
  let params = useParams();
  useEffect(()=> {
    
    socket.emit('getlogs', params)
  }, [])
  return (
    <div className='flex flex-col items center h-full'>
      <Game/>
    </div>
  )

}