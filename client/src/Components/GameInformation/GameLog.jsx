import {useContext, useState} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'


const GameLog = () => {

  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext)

  return (
    <div className="w-1/5 bg-secondary rounded-md">
      <h2>Game Log</h2>
      <div>

      </div>
    </div>
  )
}

export default GameLog;