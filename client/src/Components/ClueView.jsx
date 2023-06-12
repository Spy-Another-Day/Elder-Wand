import {useState, useContext, useEffect} from 'react';
import ClueInput from '../ClueInput.jsx';

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ teamTurn, editor = false }) => {
  const [editing, setEditing] = useState(editor);
  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketProvider);

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
    <ClueInput />
  }
}