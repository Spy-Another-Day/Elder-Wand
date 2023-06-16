import {useState, useContext, useEffect} from 'react';
import {SocketContext} from '../../socket.js';
import {GameStateContext} from '../Context.js';
import {useUser} from "@clerk/clerk-react";
import ClueInput from './ClueInput.jsx';

const ClueView = () => {
  const socket = useContext(SocketContext);
  const gameState = useContext(GameStateContext);
  const userId = useUser().user.id;
  const username = useUser().user.username;

  // This gets called within the ClueInput component
  const submitClue = (clueToShare, clueNumberToShare) => {
    let temp = gameState;
    temp.clue = clueToShare;
    temp.remainingGuesses = clueNumberToShare;
    socket.emit('gameState', temp)
    let gameLog = {}
    gameLog.roomID = gameState.roomID;
    gameLog.text = `Spymaster ${username} has given a clue: ${clueToShare} ${clueNumberToShare}`
    socket.emit('gameLog', gameLog)
  };
  const endTurnOnClick = ()=> {
    let temp = gameState
    if(temp.currentTeam === 'team_1'){
      temp.currentTeam = 'team_2'
    } else {
      temp.currentTeam = 'team_1'
    }
    var data = {}
    data.roomID = gameState.roomID
    data.text = `${username} has switched turn to opponent`
    socket.emit("gameLog", data)
    socket.emit('resetVote', gameState.roomID)
    socket.emit('gameState', temp)
  }
  

  return(
    (userId === gameState[`${gameState.currentTeam}_spymaster`][0])
    ?
    <ClueInput submitClue={submitClue} />
    :
    <div className='clue-container flex flex-row justify-center items-center p-9 z-1'>
      <div className={`p-5 border-2 ${gameState.currentTeam === 'team_1' ? 'bg-primary text-base-100 border-secondary' : 'bg-secondary border-primary'} rounded-xl`}>{ `${gameState.currentTeam === 'team_1' ? 'Team 1' : 'Team 2'}'s clue is:` }</div>
      <div className='clue p-5 kbd'>{ gameState.clue }</div>

      <div className='number p-5 kbd'>{ gameState.remainingGuesses }</div>
      {Object.keys(gameState[`${gameState.currentTeam}_members`]).includes(userId) ? (<div className=' btn  ml-10 kbd' onClick={endTurnOnClick}><p>End Turn</p></div>) : null}
    </div>    
  );
}

export default ClueView;