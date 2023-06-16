import {useContext, useEffect, useState} from 'react'
import { SocketContext } from '../../socket'
import { GameStateContext } from '../Context';
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from 'axios'

const Card = ({data, rowIndex, colIndex}) => {
  const { user } = useUser();
  const username = user.username
  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext);
  const params = useParams();

  const [clickedBy, setClickedBy] = useState([])
  const [selected, setSelected] = useState(false)

  const handleCardClicked = (data) => {
    if (Object.keys(gameState[`${gameState.currentTeam}_members`]).includes(user.id) && (gameState.team_1_spymaster[1] !== user.username || gameState.team_2_spymaster[1] !== user.username) && data.isTouched === false) {
      socket.emit('cardSelection', data, params.roomID, user.username)
    }
  }

  const handleCardSelected = (selectedWord, whoDidIt) => {

    if (selectedWord === data.word) {
      if(clickedBy.includes(username)) {
        let gameLog = {};
        gameLog.roomID = gameState.roomID;
        gameLog.socketId = socket.id;
        gameLog.text = `${username} has unselected ${data.word}`
        socket.emit('gameLog', gameLog)

      } else {
        if(whoDidIt === username){
          let gameLog = {};
          gameLog.roomID = gameState.roomID;
          gameLog.socketId = socket.id;
          gameLog.text = `${username} has voted ${data.word}`
          socket.emit('gameLog', gameLog)
        }

      }

      setClickedBy((prev) => {
        if (prev.includes(whoDidIt)) {

          return prev.filter((name) => name !== whoDidIt);
        } else {
          return [...prev, whoDidIt];
        }
      });
      setSelected(true)
    }
  }

  socket.on('resetVote',()=> {
    setClickedBy([])
  })
  const handleLockClick = () => {
    if(gameState.remainingGuesses === '?') {
      let gl = {}
      gl.roomID = gameState.roomID
      
      gl.text = `Spymaster: Be patient ${username}!`
      socket.emit("gameLog", gl)
      return;
    }
    socket.emit('resetVote', gameState.roomID)
    let temp = gameState;
    temp.words[rowIndex][colIndex].isTouched = true;

    if (temp.words[rowIndex][colIndex].belongsTo === gameState.currentTeam) {
      temp[`${temp.words[rowIndex][colIndex].belongsTo}_score`] += temp.score;
      temp.score *= 2;
      temp[`${temp.words[rowIndex][colIndex].belongsTo}_guess_goal`]--;
      temp[`${temp.words[rowIndex][colIndex].belongsTo}_guessed`]++;
      if (temp.remainingGuesses === -1) {
        gameState.currentTeam === gameState.team_1 ? temp.currentTeam = gameState.team_2 : temp.currentTeam = gameState.team_1;
        temp.remainingGuesses = '?';
        temp.clue = 'waiting on clue...'
      }




      if(temp[`${gameState.currentTeam}_guess_goal`] === 0) {
        //endgame
        temp.winReason = 'all code revealed'
        temp.teamWon = temp.curretTeam
        temp.stage = 'result'
        temp.winner_score = temp[`${temp.currentTeam}_score`];

        let gl = {}
        gl.roomID = gameState.roomID
        
        gl.text = `${gameState.currentTeam} is the winner!`
        socket.emit("gameLog", gl)

        axios.post(`${import.meta.env.VITE_SERVER_URL}/history`, temp)
        .then(data => console.log(data))
        .catch(err => console.log(err))
      }


      temp.remainingGuesses = Number.parseInt(temp.remainingGuesses) - 1;

      socket.emit('gameState', temp)
      lockOnClick()

    } else if (temp.words[rowIndex][colIndex].belongsTo === 'bystander') {
      temp.score = 1;
      temp.clue = 'waiting for clue...'
      temp.remainingGuesses = '?';
      gameState.currentTeam === gameState.team_1 ? temp.currentTeam = gameState.team_2 : temp.currentTeam = gameState.team_1
      socket.emit('gameState', temp)
      lockOnClick()

    } else if (temp.words[rowIndex][colIndex].belongsTo === 'assassin') {
      // end game
      // update gameState.stage to 'result'
      // update gameState.teamWon to the other team
      temp.score = 1;
      temp.winner_score = temp[`${temp.currentTeam}_score`];
      temp.stage = 'result';
      temp.teamWon = gameState.currentTeam === 'team_1' ? 'team_2' : 'team_1';
      temp.winReason = 'assassinated'
      axios.post(`${import.meta.env.VITE_SERVER_URL}/history`, temp)
      .then(data => console.log(data))
      .catch(err => console.log(err))

      let gl = {}
      gl.roomID = gameState.roomID
      var name = gameState[`${gameState.currentTeam}_spymaster`][1]
      gl.text = `${gl} has been assassinated`
      socket.emit("gameLog", gl)

      socket.emit('gameState', temp)
      lockOnClick()
    } else {
      temp.clue = 'waiting for clue...';
      temp.remainingGuesses = '?';
      temp[`${temp.words[rowIndex][colIndex].belongsTo}_guess_goal`] -= 1;
      temp[`${temp.words[rowIndex][colIndex].belongsTo}_guessed`]++;
      gameState.currentTeam === gameState.team_1 ? temp.currentTeam = gameState.team_2 : temp.currentTeam = gameState.team_1
      temp[`${temp.currentTeam}_score`] += temp.score;

      temp.score = 1;
      if(temp[`${temp.words[rowIndex][colIndex].belongsTo}_guess_goal`] === 0) {
        //endgame
        temp.winner_score = temp[`${temp.currentTeam}_score`];
        temp.winReason = 'all code revealed (last one by opponent)'
        temp.teamWon = temp.words[rowIndex][colIndex].belongsTo
        temp.stage = 'result'

        let gl = {}
        gl.roomID = gameState.roomID
        
        gl.text = `${temp.words[rowIndex][colIndex].belongsTo} is the winner!`
        socket.emit("gameLog", gl)
        axios.post(`${import.meta.env.VITE_SERVER_URL}/history`, temp)
        .then(data => console.log(data))
        .catch(err => console.log(err))
      }

      socket.emit('gameState', temp)
      lockOnClick()
    }

  }

  useEffect(() => {
    socket.on('selectedCard', handleCardSelected)
    return () => {
      socket.off('selectedCard', handleCardSelected)
    }
  })


  const lockOnClick = ()=> {
    let gameLog = {};
    gameLog.roomID = gameState.roomID;
    gameLog.text = `${username} has revealed ${data.word}`

    socket.emit('gameLog', gameLog)
  }

  if (gameState.team_1_spymaster[0] === user.id || gameState.team_2_spymaster[0] === user.id) {
    return (
      <div
        className={`btn m-1 w-40 h-24 flex flex-col border-2 ${gameState.currentTeam === 'team_1' ? 'border-secondary' : 'border-primary'} cursor-default ${
          data.belongsTo === 'assassin'
          ? 'btn-warning'
          : data.belongsTo === 'bystander'
          ? 'btn-accent'
          : data.belongsTo === 'team_1'
          ? 'btn-primary'
          : data.belongsTo === 'team_2'
          ? 'btn-secondary'
          : 'btn-neutral'}
          `}
      >
        {selected ? <div className={`font-light flex flex-col`}>
          {clickedBy.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div> : null}

        <p className='font-bold'>{data.word}</p>
        {data.isTouched ? (<div className='flex w-min indicator-bottom '>
          <i className="fa-solid fa-user-secret"></i>
        </div>) : null}

      </div>
    )
  } else if (gameState.team_1_spymaster[1] !== user.username || gameState.team_2_spymaster[1] !== user.username) {
    return (
      <div
        className={`btn border-2  ${gameState.currentTeam === 'team_1' ? 'border-secondary' : 'border-primary'} ${
          data.isTouched ? data.belongsTo === 'assassin'
          ? 'btn-warning'
          : data.belongsTo === 'bystander'
          ? 'btn-accent'
          : data.belongsTo === 'team_1'
          ? 'btn-primary'
          : data.belongsTo === 'team_2'
          ? 'btn-secondary'
          : 'btn-neutral'
          : 'btn-neutral' } m-1 w-40 h-24 flex flex-col indicator`}
      >
        {selected ? <div className={`font-light  flex flex-col`}>
          {clickedBy.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div> : null}


        {Object.keys(gameState[`${gameState.currentTeam}_members`]).includes(user.id) && data.isTouched === false ? <div className='flex w-min absolute indicator-item pr-8 pt-8'>
          <i onClick={handleLockClick} className="fa-solid fa-lock"></i>
        </div> : null}

        <p className='font-bold' onClick={() => {handleCardClicked(data)}}>{data.word}</p>

        {data.isTouched ? (<div className='flex w-min indicator-bottom'>
          <i className="fa-solid fa-user-secret"></i>
        </div>) : null}
      </div>
    )
  } else {
    return (
      <p>loading..</p>
    )
  }

}

export default Card