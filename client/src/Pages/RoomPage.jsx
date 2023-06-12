import react, {useEffect, useState, userRef} from 'react';
import Gameboard from '../Components/Gameboard/Gameboard.jsx'
const RoomPage = () => {

  const [inGame, setInGame] = useState(true);

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