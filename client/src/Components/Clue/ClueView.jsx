import {useState, useContext, useEffect} from 'react';
import {SocketContext} from '../../socket.js';
import {GameStateContext} from '../Context.js';
import {useUser} from "@clerk/clerk-react";
import ClueInput from './ClueInput.jsx';

const ClueView = () => {
  const socket = useContext(SocketContext);
  const gameState = useContext(GameStateContext);
  console.log('game state in ClueView: ', gameState);
  //  EDITING logic
  const userId = useUser().user.id;
  const username = useUser().user.username;
  // Editing is true when gameState.<currentTeam>_spymaster is this user's userId
  const [editing, setEditing] = useState(userId === gameState[`${gameState.currentTeam}_spymaster`][0]);
  useEffect(() => {
    // Update if gameState changes (i.e., when currentTeam switches)
    setEditing(userId === gameState[`${gameState.currentTeam}_spymaster`][0]);
  }, [gameState]);


  // CLUE LOGIC
  const [clue, setClue] = useState(['waiting for clue...', '?']);  // clue[0] is clue text, clue[1] is number of cards
  useEffect(() => {
    socket.on('clue', (clue, clueNumber) => {
      console.log('got clue');
      setClue([clue, clueNumber]);
    });
    return () => socket.removeAllListeners('clue');
  }, [socket]);

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    socket.emit('clue', gameState.roomID, clueToShare, clueNumberToShare);

    var gameLog = {}
    gameLog.roomID = gameState.roomID;
    gameLog.text = `Spymaster ${username} has given a clue: ${clueToShare} ${clueNumberToShare}`
    socket.emit('gameLog', gameLog)

    setEditing(false);
  };

  return(
    !editing
    ?
    <div className='clue-container p-5'>
      <div className='p-5'>{ `${gameState.currentTeam === 'team_1' ? 'Team 1' : 'Team 2'}'s clue is:` }</div>
      <div className='clue p-5 kbd'>{ clue[0] }</div>
      <div className='number p-5 kbd'>{ clue[1] }</div>
    </div>
    :
    <ClueInput submitClue={submitClue} />
  );
}

export default ClueView;