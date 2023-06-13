import react, { useEffect, useState, userRef, useContext } from "react";
import Gameboard from "../Components/Gameboard/Gameboard.jsx";
import { SocketContext } from "../socket.js";
import { useParams } from "react-router-dom";
const RoomPage = () => {
  const socket = useContext(SocketContext);

  const [inGame, setInGame] = useState(true);
  const params = useParams();

  socket.emit("roomID", params);
  let topic = "Technology";
  useEffect(() => {
    let temp = {};
    temp.roomID = params.roomID;
    temp.topic = topic;
    //temp.cards
    //temp.assassins
    //temp.agents
    socket.emit("roomExist", temp);

    // axios.get(`${import.meta.env.VITE_SERVER_URL}/initGame/${topic}`)
    // .then(({data}) => {
    //   data.roomID = params.roomID;

    //   socket.emit('initialGameState', data)

    // })
    // .catch(err=>console.log(err))
  }, []);

  if (inGame) {
    return <Gameboard />;
  }
  return (
    <>
      <h1>This is the room page</h1>
    </>
  );
};

export default RoomPage;
