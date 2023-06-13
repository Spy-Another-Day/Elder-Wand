import react, {useEffect, useState, userRef, useContext} from 'react';
import Game from './Game.jsx'
import Chat from '../Chat.jsx'
import axios from 'axios';
import { SocketContext } from '../../socket.js';


export default function Gameboard() {
  const socket = useContext(SocketContext);
  //maybe sent from upper component

  //fix:running twice


  return (<>
    <Game/>
    <Chat />
  </>)

}