/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import react, {useEffect, useState, userRef, useContext} from 'react';
import { SocketContext } from '../../socket.js';

export default function Cards({row}) {


  return (
    <div className="">
      {row.map((e,i)=>{
        return (
          <div key={i} className="btn  "> {e.word}</div>
        )
      })}
    </div>
  )
}