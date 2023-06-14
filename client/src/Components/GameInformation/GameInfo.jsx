import {useContext, useState} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'


const GameInfo = () => {

  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext)


  return (
    <div>
      <div>
        <div className="flex justify-center">
          <p className="mr-5 mt-5 bg-secondary rounded-md p-1">Team 1 Remaining Guesses: {gameState.team_1_guess_goal}</p>
          <p className="mr-5 mt-5 bg-secondary rounded-md p-1">Team 2 Remaining Guesses: {gameState.team_2_guess_goal}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex ml-[4vw] bg-secondary rounded-md p-1">
            <p>Team 1:&#160;</p>
            <div className="flex">
              {Object.keys(gameState.team_1_members).map((key) => {
                return (
                  <p>{gameState.team_1_members[key]} &#160;</p>
                )
              })}
              <p>player</p>
            </div>
          </div>
          <div className="flex mr-[18.2vw] bg-secondary rounded-md p-1">
            <p>Team 2:&#160;</p>
            <div className="flex">
              {Object.keys(gameState.team_2_members).map((key) => {
                return (
                  <p>{gameState.team_2_members[key]} &#160;</p>
                )
              })}
              <p>player</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default GameInfo;