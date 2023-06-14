import {useContext, useState, useRef} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'


const GameLog = () => {

  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext)
  const gameLogRef = useRef();

  socket.on("gameLog", data => {
    if(gameLogRef.current !== undefined) {
      var element = document.createElement('p');
      element.textContent = data
      gameLogRef.current.appendChild(element);
      gameLogRef.current.scrollTop = gameLogRef.current.scrollHeight;
    }

  })


  return (
    <div className="w-1/5 bg-secondary rounded-md">
      <h2>Game Log</h2>
      <div id="gameLog" ref={gameLogRef}>

      </div>
    </div>
  )
}

export default GameLog;