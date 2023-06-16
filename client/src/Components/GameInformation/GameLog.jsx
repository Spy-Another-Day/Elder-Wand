import {useContext, useState, useRef, useEffect} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'


const GameLog = () => {

  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext)
  const gameLogRef = useRef();

  const [log,setLog] = useState([])

  socket.on("gameLog", data => {
      setLog(data);
  })

  useEffect(()=> {
    if(gameLogRef.current !== undefined) {
      gameLogRef.current.scrollTop = gameLogRef.current.scrollHeight
    }
  },[log])


  return (
    <div className="w-1/5 bg-accent rounded-md" >
      <div className='flex flex-row'>

        <div className="flex flex-col text-neutral bg-primary rounded-md border border-neutral w-[50%] flex-wrap p-1">
          <p>Team 1:&#160;</p>
          <p>spymaster: {gameState.team_1_spymaster[1]} &#160;</p>
          <div className="flex justify-center flex-wrap">
            <p>players:&#160;</p>
            {Object.keys(gameState.team_1_members).map((key) => {
              return (
                  <div key={key}>{gameState.team_1_members[key]} &#160;</div>
                )
              })}
            {/* <p>player</p> */}
          </div>
          <p className="bg-primary text-neutral rounded-md p-1">Team 1 Remaining cards: {gameState.team_1_guess_goal}</p>
        </div>

        <div className="flex flex-col bg-secondary rounded-md border border-neutral w-[50%] flex-wrap  p-1">
          <p>Team 2:&#160;</p>
          <p>spymaster: {gameState.team_2_spymaster[1]} &#160;</p>
          
          <div className="flex justify-center flex-wrap">
            <p>players:&#160;</p>
            {Object.keys(gameState.team_2_members).map((key) => {
              return (
                <p key={key}>{gameState.team_2_members[key]} &#160;</p>
                )
              })}
          </div>
          <p className="bg-secondary rounded-md p-1">Team 2 Remaining cards: {gameState.team_2_guess_goal}</p>
        </div>
      </div>

      <h2>Game Log</h2>
      <div id="gameLog" ref={gameLogRef} className="bg-accent min-w-full rounded-md pb-1 overflow-y-scroll min-h-[50%] max-h-[20vh]">
      {log.map(e => (<p>{e}</p>))}
      </div>
    </div>
  )
}

export default GameLog;