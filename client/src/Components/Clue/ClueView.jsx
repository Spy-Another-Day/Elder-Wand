import {useState, useContext} from 'react';
import {SocketContext} from '../../socket.js';
import ClueInput from './ClueInput.jsx';
import { GameStateContext } from '../Components/Context.js';
import { useUser } from "@clerk/clerk-react";

const ClueView = () => {
  const gameState = useContext(GameStateContext);
  const userId = useUser().user.userId;
  // Editing is true when gameState.<currentTeam>_spymaster is this user's userId
  const [editing, setEditing] = useState(userId === gameState[`${gameState.currentTeam}_spymaster`]);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketContext);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    socket.emit('clue', gameState.roomId, clueToShare, clueNumberToShare);
    setEditing(false);
  };

  socket.on('clue', (clue, clueNumber) => {
    setClue(clue);
    setClueNumber(clueNumber);
  });

  return(
    editing
    ?
    <div className='clue-container p-5'>
      <div className='p-5'>{ `${gameState.currentTeam === 'team_1' ? 'Team 1' : 'Team 2'}'s clue is ...` }</div>
      <div className='clue p-5 kbd'>{ clue }</div>
      <div className='number p-5 kbd'>{ clueNumber }</div>
    </div>
    :
    <ClueInput submitClue={submitClue}/>
  );
}

export default ClueView;