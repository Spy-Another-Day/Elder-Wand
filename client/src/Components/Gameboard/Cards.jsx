/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';
import Card from '../Card.jsx';

export default function Cards({isSpyMaster, row}) {
  console.log(isSpyMaster)

  return (
    <div className="bg-blue-700 flex flex-row justify-center w-min">
      {row.map((e,i)=>{
        console.log(e)
          return (
            <Card data={e} key={i} /> 
          )
      })}
    </div>
  )
}