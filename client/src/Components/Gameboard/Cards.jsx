/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Card from './Card.jsx';

export default function Cards({isSpymaster, row}) {

  return (
    <div className="bg-blue-700 flex flex-row justify-center w-min">
      {row.map((card,i)=>{
          return (
            <Card data={card} key={i} isSpymaster={isSpymaster}/>
          )
      })}
    </div>
  )
}