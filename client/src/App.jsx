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

  socket.on("session", );

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect();
    }

    const handleConnectError = (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    };
    const handleSession = ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    }

    socket.on("connect_error", handleConnectError);
    socket.on("session", handleSession)
    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("session", handleSession)
    };
  }, [socket]);

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
