import react, {useEffect, useState, userRef, useContext} from 'react';
import Game from './Game.jsx'
import axios from 'axios';
import { SocketContext } from '../../socket.js';
import ClueView from '../Clue/ClueView.jsx';

export default function Gameboard() {
  const socket = useContext(SocketContext);
  //maybe sent from upper component
  let topic = 'general'
  //fix:running twice

  return (
    <div className='flex flex-col items center h-full'>
      <Game/>
      <ClueView />
    </div>
  )

}