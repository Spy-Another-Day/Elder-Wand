import {useState, useContext, useEffect} from 'react';
import {SocketContext} from '../../socket.js';
import ClueInput from './ClueInput.jsx';
// import { useParams } from "react-router-dom";  // only needed for roomId if this is not included in game state object
import { GameStateContext } from '../Components/Context.js';

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ roomId, currentTeam, editor = false }) => {
  const gameState = useContext(GameStateContext);
  const [editing, setEditing] = useState(editor);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketContext);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    socket.emit('clue', roomId, clueToShare, clueNumberToShare);
    setEditing(false);
  };

  socket.on('clue', (clue, clueNumber) => {
    setClue(clue);
    setClueNumber(clueNumber);
  });

  return(
    (!editor || !editing)
    ?
    <div className='clue-container p-5'>
      <div className='p-5'>{ `${currentTeam === 'team_1' ? 'Team 1' : 'Team 2'}'s clue is ...` }</div>
      <div className='clue p-5 kbd'>{ clue }</div>
      <div className='number p-5 kbd'>{ clueNumber }</div>
    </div>
    :
    <ClueInput submitClue={submitClue}/>
  );
}

export default ClueView;