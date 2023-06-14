import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Cards from './Cards.jsx';

export default function Game(){
  const socket = useContext(SocketContext);
  const [isSpymaster, setIsSpymaster] = useState(true)
  const [gameState, setGameState] = useState({});
  const [cards, setCards] = useState([]);
  socket.on('gameState', data => {
    setGameState(data)
    setCards(data.words)
    console.log(data.host)
  })

  // socket.emit('gameState', gameState)

  if(cards.length === 0) {
    return (<progress></progress>)
  }
  else {
    return <>
    <div className="bg-red-700 flex flex-col items-center ">
      {cards.map((row, i ) => <Cards key={i} row={row} isSpymaster={isSpymaster}/>)}
    </div>
    </>
  }
}