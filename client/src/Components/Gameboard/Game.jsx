import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Cards from './Cards.jsx'
export default function Game(){
  const socket = useContext(SocketContext);

  const [gameState, setGameState] = useState({});
  const [cards, setCards] = useState([]);
  socket.on('gameState', data => {

    setGameState(data)
    setCards(data.words)
  })

  if(cards.length === 0) {
    return (<progress></progress>)
  }
  else {
    return <>
    <div className="">
      {cards.map((row, i )=> {
        return <Cards key={i} row={row}/>
      })}
    </div>

    </>
  }
}