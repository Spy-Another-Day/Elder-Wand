import {useContext, useEffect, useState} from 'react'
import { SocketContext } from '../../socket'
import { GameStateContext } from '../Context';
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";


const Card = ({data, isSpymaster, isYourTurn}) => {
  const { user } = useUser();
  const username = user.username
  const socket = useContext(SocketContext)
  const gameState = useContext(GameStateContext);
  const params = useParams();

  const [clickedBy, setClickedBy] = useState([])
  const [selected, setSelected] = useState(false)

  const handleCardClicked = (data) => {
    if (isYourTurn === true && isSpymaster === false && data.isTouched === false) {
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
        let gameLog = {};
        gameLog.roomID = gameState.roomID;
        gameLog.text = `${username} has vote ${data.word}`
        socket.emit('gameLog', gameLog)
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



  useEffect(() => {
    socket.on('selectedCard', handleCardSelected)
    return () => {
      socket.off('selectedCard', handleCardSelected)
    }
  })


  const lockOnClick = ()=> {
    var gameLog = {};
    gameLog.roomID = gameState.roomID;
    gameLog.text = `${username} has reveal ${data.word}`
    socket.emit('gameLog', gameLog)
  }

  if (gameState.team_1_spymaster[1] === user.username || gameState.team_2_spymaster[1] === user.username) {
    return (
      <div
        className={`btn m-1 w-40 h-24 flex flex-col cursor-default ${
          data.belongsTo === 'assassin'
          ? 'btn-secondary'
          : data.belongsTo === 'bystander'
          ? 'btn-warning'
          : data.belongsTo === 'team_1'
          ? 'btn-info'
          : data.belongsTo === 'team_2'
          ? 'btn-success'
          : 'btn-neutral'}
          `}
      >
        {selected ? <div className='bg-green-500 flex flex-col'>
          {clickedBy.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div> : null}
        <p onClick={() => {handleCardClicked(data)}}>{data.word}</p>
      </div>
    )
  } else if (isSpymaster === false) {
    return (
      <div
        className={`btn btn-neutral m-1 w-40 h-24 flex flex-col indicator`}
      >
        {selected ? <div className='bg-accent flex flex-col'>
          {clickedBy.map((name, index) => (
            <p key={index}>{name}</p>
          ))}
        </div> : null}

        {isYourTurn === true ? <div className='flex w-min absolute indicator-item pr-8 pt-8'>
          <i onClick={lockOnClick} className="fa-solid fa-lock"></i>
        </div> : null}

        <p onClick={() => {handleCardClicked(data)}}>{data.word}</p>
      </div>
    )
  } else {
    return (
      <p>loading..</p>
    )
  }

}

export default Card