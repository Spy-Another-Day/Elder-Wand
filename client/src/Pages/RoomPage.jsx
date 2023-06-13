import { useEffect, useState, useContext } from "react";
import Gameboard from "../Components/Gameboard/Gameboard.jsx";
import { SocketContext } from "../socket.js";
import { useParams } from "react-router-dom";
import Chat from '../components/Chat.jsx';
import { useUser } from "@clerk/clerk-react";

const RoomPage = () => {
  const socket = useContext(SocketContext);

  // 3 possible stages: init, play, result
  const [gameStage, setGameStage] = useState(true);
  const params = useParams();
  const { user } = useUser();

  let topic = "Technology";
  useEffect(() => {
    let temp = {};
    temp.roomID = params.roomID;
    temp.topic = topic;
    temp.user = user.username;
    temp.userID = user.id;
    socket.emit("initRoom", temp);

    // axios.get(`${import.meta.env.VITE_SERVER_URL}/initGame/${topic}`)
    // .then(({data}) => {
    //   data.roomID = params.roomID;

    //   socket.emit('initialGameState', data)

    // })
    // .catch(err=>console.log(err))
  }, []);

  if (gameStage) {
    return <Gameboard />;
  }
  return (
    <>
      <h1>This is the room page</h1>
    </>
  );
};

export default RoomPage;
