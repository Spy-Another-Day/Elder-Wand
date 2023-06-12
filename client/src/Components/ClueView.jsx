import {useState, useContext, useEffect} from 'react';
import ClueInput from '../ClueInput.jsx';

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ shareClue, activeTeam, passTurn, editor = false }) => {
  const [editing, setEditing] = useState(editor);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketProvider);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    // emit clue
    shareClue(clueToShare, clueNumberToShare);
    // setEditing to false
    setEditing(!editing);
    // setActiveTeam to the other team
    passTurn();
  }

  useEffect(() => {
    // listen for latest clue...
    // be sure to clean up
  }, []);

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