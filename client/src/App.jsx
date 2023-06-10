import { useContext } from 'react';
import { SocketContext } from './socket.js';
import './App.css'


function App() {


  const socket = useContext(SocketContext);

  socket.on('test123', (msg) => {
    console.log(msg)
  })

  return (
    <SocketContext.Provider value={socket}>
      <div>
        <h1>Elder Wand!</h1>
      </div>
    </SocketContext.Provider>

  )
}

export default App
