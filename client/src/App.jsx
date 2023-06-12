import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useContext } from 'react';
import { SocketContext } from './socket.js';
import './App.css'

import LandingPage from './Pages/LandingPage'
import RoomPage from './Pages/RoomPage'
import IconHome from './assets/IconHome'
import ErrorPage from './Pages/ErrorPage'

const themes = ['dark', 'light', 'retro', 'dracula', 'aqua', 'cyberpunk', 'buisness', 'Stigander', 'Zaris']
function App() {


  const socket = useContext(SocketContext);

  const [theme, setTheme] = useState('dark')

  socket.on('test123', (msg) => {
    console.log(msg)
  })

  return (
    <SocketContext.Provider value={socket}>
      <div data-theme={localStorage.getItem('theme') || theme} className='bg-primary w-screen h-screen'>

        {/* NavBar */}
        <div className="navbar bg-base-100">
          <div className="flex-none">
            <a href="/" className="btn btn-square btn-ghost">
              <IconHome />
            </a>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Spy Another Day</a>
          </div>
          <div className="flex-none">

            {/* dropdown theme menu */}
            <div className="dropdown z-10">
              <label tabIndex={0} className="btn m-1">themes</label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                {themes.map((theme, index) => (
                 <li onClick={(e) => { setTheme(e.target.innerText); localStorage.setItem('theme', e.target.innerText) }} key={index}><a>{theme}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* Main Section */}
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/room/:roomID" element={<RoomPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        </BrowserRouter>

      </div>
    </SocketContext.Provider>

  )
}

export default App
