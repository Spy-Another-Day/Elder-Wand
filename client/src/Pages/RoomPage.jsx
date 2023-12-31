import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../socket.js";
import { useParams } from "react-router-dom";
import Gameboard from "../Components/Gameboard/Gameboard.jsx";
import GameSetup from '../Components/GameSetup'
import { useUser } from "@clerk/clerk-react";
import { GameStateContext } from '../Components/Context.js'

const RoomPage = () => {
  const socket = useContext(SocketContext);
  const params = useParams();
  let topic = "general";
  const { user } = useUser();

  // TODO: there should be a better way to determine the stage of the game
  // component rendered also depends on the role of the player
  // ie. spymaster vs. operator
  // 3 possible stages: init, play, result
  // const [stage, setStage] = useState("init");
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    let temp = {};
    temp.roomID = params.roomID;
    temp.topic = topic;
    temp.user = user.username;
    temp.userID = user.id;
    socket.emit("initRoom", temp);
  }, []);

  socket.on('gameState', data => {
    setGameState(data)
    
  });

  // const nextStage = (currentStage) => {
  //   const stages = ['init', 'play', 'result'];
  //   const currentIndex = stages.indexOf(currentStage);
  //   const nextIndex = (currentIndex+1) % 3;
  //   setStage(stages[nextIndex]);
  // }



  return (
    <GameStateContext.Provider value={gameState}>
      {gameState.stage === 'init' && (<GameSetup />)}
      {gameState.stage === 'play' && (<Gameboard />)}
      {gameState.stage === 'result' && (<Gameboard />)}
    </GameStateContext.Provider>
  );
};

export default RoomPage;
