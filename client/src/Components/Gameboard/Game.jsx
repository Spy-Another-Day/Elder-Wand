import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Cards from './Cards.jsx';
import ClueView from '../Clue/ClueView.jsx';
import { GameStateContext } from '../Context.js'
import Scoreboard from '../Scoreboard';

export default function Game(){
  const socket = useContext(SocketContext);
  const [isSpymaster, setIsSpymaster] = useState(true)
  const [cards, setCards] = useState([]);
  const gameState = useContext(GameStateContext);

  useEffect(()=>{
    setCards(gameState.words)
  }, [gameState])

  // socket.emit('gameState', gameState)

  if(cards.length === 0) {
    return (<progress></progress>)
  }
  else {
    return <>
      <Scoreboard />
    <div className="bg-red-700 flex flex-col items-center ">
      {cards.map((row, i ) => <Cards key={i} row={row} isSpymaster={isSpymaster}/>)}
    </div>
    </>
  }
}