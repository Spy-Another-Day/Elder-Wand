import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../socket.js";
import { useParams } from "react-router-dom";
import Gameboard from "../Components/Gameboard/Gameboard.jsx";
import GameSetup from '../Components/GameSetup'
import { useUser } from "@clerk/clerk-react";

const RoomPage = () => {
  const socket = useContext(SocketContext);
  const params = useParams();
  let topic = "Technology";
  const { user } = useUser();

  // 3 possible stages: init, play, result
  const [stage, setStage] = useState("init");


  useEffect(() => {
    let temp = {};
    temp.roomID = params.roomID;
    temp.topic = topic;
    temp.user = user.username;
    temp.userID = user.id;
    console.log('temp', temp)
    socket.emit("initRoom", temp);
  }, []);

  const nextStage = (currentStage) => {
    const stages = ['init', 'play', 'result'];
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = (currentIndex+1) % 3;
    setStage(stages[nextIndex]);
  }


  return (
    <>
      {stage === 'init' && (<GameSetup nextStage={nextStage} />)}
      {stage === 'play' && (<Gameboard />)}
      {stage === 'result' && (<Gameboard />)}
    </>
  );
};

export default RoomPage;
