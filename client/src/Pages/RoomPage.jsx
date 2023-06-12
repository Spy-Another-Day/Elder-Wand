import react, {useEffect, useState, userRef, useContext} from 'react';
import Gameboard from '../Components/Gameboard/Gameboard.jsx'
import { SocketContext } from '../socket.js';
import { useParams } from 'react-router-dom'
const RoomPage = () => {
  const socket = useContext(SocketContext);

  const [inGame, setInGame] = useState(true);
  const params = useParams();

  socket.emit('roomID',params )

  if(inGame) {
    return (
<Gameboard/>
    )
  }
  return (
    <>
      <h1>This is the room page</h1>
    </>
  )
}

export default RoomPage;