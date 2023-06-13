import { useContext } from 'react';
import { SocketContext } from './socket.js';
import Chat from './components/Chat.jsx';
import './App.css'


function App() {


  const socket = useContext(SocketContext);

  return (
    <SocketContext.Provider value={socket}>
      <div>
        <h1>Elder Wand!</h1>
        <Chat />
      </div>
    </SocketContext.Provider>

  )
}

export default App
