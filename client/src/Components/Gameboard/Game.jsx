import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'
import Cards from './Cards.jsx';
import ClueView from '../Clue/ClueView.jsx';
import GameInfo from '../GameInformation/GameInfo';
import Chat from '../GameInformation/Chat.jsx'
import GameLog from '../GameInformation/GameLog.jsx'

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
    <GameInfo />
    <div className="flex justify-evenly mt-2 h-[54%]">
      <GameLog />
      <div className="bg-primary flex flex-col items-center h-[10vh]">
        {cards.map((row, i ) => <Cards key={i} row={row} isSpymaster={isSpymaster}/>)}
      </div>
      <Chat />
    </div>
    </>
  }
}