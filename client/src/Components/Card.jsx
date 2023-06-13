import React from 'react'

const Card = ({data}) => {
  return (
    <div 
      onClick={(e) => {console.log(e.target.innerText, 'was clicked')}} 
      className={`btn m-1 w-28 ${data.belongsTo === 'assassin' ? 'btn-secondary' 
        : data.belongsTo === 'bystander' 
        ? 'btn-warning' 
        : data.belongsTo === '0' 
        ? 'btn-info' 
        : data.belongsTo === '1' 
        ? 'btn-success'
        : 'btn-neutral'} 
        `}
    > 
      {data.word}
    </div>
  )
}

export default Card