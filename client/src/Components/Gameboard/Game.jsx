import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import { GameStateContext } from '../Context.js'
import Cards from './Cards.jsx';
import Chat from '../GameInformation/Chat.jsx'
import GameLog from '../GameInformation/GameLog.jsx';
import ClueView from '../Clue/ClueView.jsx';
import GameResult from '../GameResult.jsx';

export default function Game(){
  const socket = useContext(SocketContext);
  const [cards, setCards] = useState([]);
  const gameState = useContext(GameStateContext);
  useEffect(()=>{
    setCards(gameState.words)
  }, [gameState])

  // socket.emit('gameState', gameState)

  if(cards.length === 0) {
    return <progress/>
  } else {
    return (
      <div className={`flex flex-col h-full ${gameState.currentTeam === 'team_1' ? 'bg-info' : 'bg-success'} cat `}>
        <div className="flex  flex-row justify-evenly mt-2 h-min">
          <GameLog />

          {gameState.stage === 'play' && (
          <div className="bg-primary flex flex-col items-center h-min">
            {cards.map((row, i ) => <Cards key={i} rowIndex={i} row={row}/>)}
          </div>
          )}

          {gameState.stage === 'result' && (<GameResult result={gameState.teamWon}/>) }
          <Chat />
        </div>
        
        {gameState.stage === 'play' && ( <ClueView />)}
      </div>
    )
  }
}