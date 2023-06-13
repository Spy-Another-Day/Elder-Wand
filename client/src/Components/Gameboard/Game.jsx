import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Cards from './Cards.jsx';
import ClueView from '../Clue/ClueView.jsx';

export default function Game(){
  const socket = useContext(SocketContext);

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
    <div className="">
      {cards.map((row, i )=> {
        return <Cards key={i} row={row}/>
      })}
    </div>
    {/* This can move up to GameBoard component once we move the GameState there */}
    <ClueView roomId={gameState.roomId} currentTeam={gameState.currentTeam} editor={true} />
    {/* isSpyMaster && gameState.currentTeam === 'team_2' */}
    </>
  }
}