import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Cards from './Cards.jsx';
import ClueView from '../Clue/ClueView.jsx';

export default function Game(){
  const socket = useContext(SocketContext);
  const [isSpymaster, setIsSpymaster] = useState(true)
  const [gameState, setGameState] = useState({});
  const [cards, setCards] = useState([]);
  socket.on('gameState', data => {
    setGameState(data)
    setCards(data.words)
  })

  const isSpyMaster = true;
  // socket.emit('gameState', gameState)

  if(cards.length === 0) {
    return (<progress></progress>)
  }
  else {
    return <>
    <div className="bg-red-700 flex flex-col items-center ">
      {cards.map((row, i ) => <Cards key={i} row={row} isSpymaster={isSpymaster}/>)}
    </div>
    {/* This can move up to GameBoard component once we move the GameState there */}
    <ClueView roomId={gameState.roomId} currentTeam={gameState.currentTeam} editor={true} />
    {/* isSpyMaster && gameState.currentTeam === 'team_2' */}
    </>
  }
}