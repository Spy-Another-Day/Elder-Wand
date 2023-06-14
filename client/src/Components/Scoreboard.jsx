import {useContext, useState} from 'react';
import { SocketContext } from '../socket.js';
import { GameStateContext } from '../Components/Context.js'


const Scoreboard = () => {

  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext)


  return (
    <div>
      <h3>SCOREBOARD</h3>
      <div className="flex justify-center">
        <p className="mr-5">Team 1 Remaining Guesses: {gameState.team_1_guess_goal}</p>
        <p>Team 2 Remaining Guesses: {gameState.team_2_guess_goal}</p>
      </div>
    </div>
  )
}

export default Scoreboard;