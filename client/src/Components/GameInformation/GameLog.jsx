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
    <div className="w-1/5 bg-secondary rounded-md" >
      <h2>Game Log</h2>
      <div id="gameLog" ref={gameLogRef} className="bg-secondary min-w-full rounded-md pb-1 overflow-y-scroll" style={{minHeight: "100%",maxHeight: "45vh"}}>
      {log.map(e => (<p>{e}</p>))}
      </div>
    </div>
  )
}

export default GameLog;