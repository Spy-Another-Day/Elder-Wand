import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../socket.js";


const GameSetup = ({ nextStage }) => {
  const socket = useContext(SocketContext);

  const [gameState, setGameState] = useState({});

  // useEffect(() => {
  //   const updateState = data => {
  //     setGameState(data)
  //   }

  //   socket.on('gameState', updateState);

  //   return () => {
  //     socket.off('gameState', updateState);
  //   }
  // }, []);

  const updateState = data => {
    setGameState(data)
  }

  socket.on('gameState', updateState);


  console.log('rendered', gameState)


  return (
    <div className="container flex flex-col h-5/6 max-w-6xl mx-auto my-12 px-8">
      <div className="relative block h-2/3 md:flex items-center space-x-8 my-8">
        <div className="w-full h-full md:w-1/2 relative rounded bg-neutral shadow-lg overflow-hidden py-8">
          <h1>Red Team</h1>

        </div>

        <div className="w-full h-full md:w-1/2 relative rounded bg-neutral shadow-lg overflow-hidden py-8">
          <h1>Blue Team</h1>
        </div>

      </div>

      <div>
        <div>
          Undecided {2 / 8}
          <br />
          waiting on
          <br />
          {gameState.players && Object.values(gameState.players).map((player, idx) => {
            return (
              <span key={idx}>{player} </span>
            )
          })}
        </div>
      </div>
      <button onClick={() => nextStage("init")}>Next</button>
    </div>
  );
}

export default GameSetup;