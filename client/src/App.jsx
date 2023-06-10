import { useState, useContext } from 'react';
import { SocketContext } from './socket.js';
import './App.css'

const themes = ['dark', 'light', 'retro', 'dracula',  'aqua',  'cyberpunk',  'buisness', 'Stigander', 'Zaris']
function App() {


  const socket = useContext(SocketContext);

  const [theme, setTheme] = useState('dark')

  socket.on('test123', (msg) => {
    console.log(msg)
  })

  return (
    <SocketContext.Provider value={socket}>
      <div data-theme={theme} className='bg-primary w-screen h-screen'>
        {/* dropdown theme menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn m-1">themes</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {themes.map((theme, index) => (
              <li onClick={(e) => {setTheme(e.target.innerText)}} key={index}><a>{theme}</a></li>
            ))}
          </ul>
        </div>

        <h1>Elder Wand!</h1>
        <button className='btn btn-accent'>join room</button>
      </div>
    </SocketContext.Provider>

  )
}

export default App
