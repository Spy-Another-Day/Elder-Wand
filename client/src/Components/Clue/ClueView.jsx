import {useState, useContext, useEffect} from 'react';
import {SocketContext} from '../../socket.js';
import ClueInput from './ClueInput.jsx';
import { useParams } from "react-router-dom";  // only needed for roomId

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ roomId, currentTeam, editor = false }) => {
  roomId = roomId || useParams().roomID;
  const [editing, setEditing] = useState(editor);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketContext);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    // emit clue
    socket.emit('clue', roomId, clueToShare, clueNumberToShare);
    // setEditing to false
    setEditing(false);
  }

  socket.on('clue', (clue, clueNumber) => {
    console.log(clue);
    setClue(clue);
    setClueNumber(clueNumber);
  });

  return(
    (!editor || !editing)
    ?
    <div className='clue-container'>
      <div className='clue'>{ clue }</div>
      <div className='number'>{ clueNumber }</div>
    </div>
    :
    <ClueInput submitClue={submitClue}/>
  );
}

export default ClueView;