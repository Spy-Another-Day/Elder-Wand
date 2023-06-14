import react, {useEffect, useState, userRef, useContext} from 'react';
import Record from './Record.jsx'
import axios from 'axios'
export default function MatchHistory(){

  const [history, setHistory] = useState([])
  useEffect(()=> {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/history`)
    .then(result => {
      setHistory(result.data);
    })
    .catch(err => console.log(err))
  },[])

  if(history.length === 0) {
    return (
      <>loading</>
    )
  }
else{
  return (
    <div >
      {history.map((record, index )=> {
        return <Record key={index} record={record}/>
      })}

</div>

  )
}



}