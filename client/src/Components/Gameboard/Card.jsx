import React from 'react'

const Card = ({data, isSpymaster}) => {

  if (isSpymaster === true) {
    return (
      <div 
        onClick={(event) => {console.log(event.target.innerText, 'was clicked')}} 
        className={`btn m-1 w-40 h-24 ${
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
        {data.word}
      </div>
    )
  } else if (isSpymaster === false) {
    return (
      <div 
        onClick={(event) => {console.log(event.target.innerText, 'was clicked')}} 
        className={`btn btn-neutral m-1 w-40 h-24 `}> 
        {data.word}
      </div>
    )
  } else {
    return (
      <p>loading..</p>
    )
  }
  
}

export default Card