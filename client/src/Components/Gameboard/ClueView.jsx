import {useState, useContext, useEffect} from 'react';
import ClueInput from './ClueInput.jsx';

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ room, currentTeam, editor = false }) => {
  const [editing, setEditing] = useState(editor);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketProvider);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    // emit clue
    socket.to(room).emit('clue', {clue: clueToShare, clueNumber: clueNumberToShare});
    // setEditing to false
    setEditing(!editing);
  }
  socket.on('clue', data => {
    setClue(data.clue);
    setClueNumber(data.clueNumber);
  })

  { (!editor && !editing)
    ?
    <div className='clue-container'>
      <div className='clue'>{ clue }</div>
      <div className='number'>{ clueNumber }</div>
    </div>
    :
    <ClueInput submitClue={submitClue}/>
  }
}