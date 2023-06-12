import {useState, useContext} from 'react';

// editor should be true when isSpyMaster and teamTurn matches own team
const ClueView = ({ teamTurn, editor = false }) => {

  const [clue, setClue] = useState('waiting for clue...');
  const [clueNumber, setClueNumber] = useState('');
  const socket = useContext(SocketProvider);

  useEffect(() => {
    // listen for latest clue...
    // be sure to clean up
  }, []);

  { !editor
    ?
    <div className='clue-container'>
      <div className='clue'>{ clue }</div>
      <div className='number'>{ clueNumber }</div>
    </div>
    :
    <div className='clue-container'>
      { // input
      }
    </div>
  }
}