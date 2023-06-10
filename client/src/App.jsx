import { useState, useContext, useEffect } from 'react';
import SelectUsername from "./components/SelectUsername";
import Chat from "./components/Chat";
import { SocketContext } from './socket.js';
import './App.css'

const themes = ['dark', 'light', 'retro', 'dracula',  'aqua',  'cyberpunk',  'business', 'Stigander', 'Zaris']
function App() {


  const socket = useContext(SocketContext);

  const [theme, setTheme] = useState('Zaris')





  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  const onUsernameSelection = (username) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  useEffect(() => {
    const handleConnectError = (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    };

    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect_error", handleConnectError);
    };
  }, []);

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

        {!usernameAlreadySelected ? (
        <SelectUsername onInput={onUsernameSelection} />
      ) : (
        <Chat />
      )}
      </div>
    </SocketContext.Provider>

  )
}

export default App
