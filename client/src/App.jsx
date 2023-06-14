import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useContext } from 'react';
import { SocketContext } from './socket.js';
import './App.css'
import { UserButton } from '@clerk/clerk-react';

import LandingPage from './Pages/LandingPage'
import RoomPage from './Pages/RoomPage'
import IconHome from './assets/IconHome'
import ErrorPage from './Pages/ErrorPage'
import MatchHistory from './Components/MatchHistory/MatchHistory'

const themes = ['Spies', 'dark', 'light', 'retro', 'dracula', 'aqua', 'cyberpunk', 'business', 'Stigander', 'Zaris']
function App() {


  const socket = useContext(SocketContext);
  // console.log(socket)
  const [theme, setTheme] = useState('Spies')

  socket.on('test123', (msg) => {
    console.log(msg)
  })

  return (
    <SocketContext.Provider value={socket}>
      <div data-theme={localStorage.getItem('theme') || theme} className='bg-primary h-screen w-screen overflow-clip'>

        {/* NavBar */}
        <div className="navbar max-w-full bg-base-100">
          <div className="flex-none">
            <a href="/" className="btn btn-square btn-ghost">
              <IconHome />
            </a>
          </div>
          <div className="flex-1">
            <a href="/leaderboard" className="btn btn-ghost normal-case text-xl">Leader Board</a>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Spy Another Day</a>
          </div>

          <div className="flex-none">
            <UserButton showName='true' />
            {/* dropdown theme menu */}
            <div className="dropdown z-10">
              <label tabIndex={0} className="btn m-1 ml-5">themes</label>
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
          <Route path="/leaderboard" element={<MatchHistory/>}/>
          <Route path="/room/:roomID" element={<RoomPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        </BrowserRouter>

      </div>
    </SocketContext.Provider>

  )
}

export default App





// {
//   "topic": "general",
//   "words": [
//     "Pizza",
//     "Sushi",
//     "Burger",
//     "Pasta",
//     "Taco",
//     "Salad",
//     "Steak",
//     "Burrito",
//     "Noodle",
//     "Cheese",
//     "Ice Cream",
//     "Dumpling",
//     "Pancake",
//     "Muffin",
//     "Sandwich",
//     "Popcorn",
//     "Soup",
//     "Pineapple",
//     "Waffle",
//     "Grapes",
//     "Lion",
//     "Elephant",
//     "Tiger",
//     "Giraffe",
//     "Penguin",
//     "Kangaroo",
//     "Zebra",
//     "Monkey",
//     "Panda",
//     "Horse",
//     "Koala",
//     "Octopus",
//     "Dolphin",
//     "Crocodile",
//     "Owl",
//     "Butterfly",
//     "Turtle",
//     "Rabbit",
//     "Squirrel",
//     "Gorilla",
//     "Car",
//     "Motorcycle",
//     "Bus",
//     "Truck",
//     "Bicycle",
//     "Boat",
//     "Train",
//     "Helicopter",
//     "Airplane",
//     "Scooter",
//     "Van",
//     "Submarine",
//     "Jet",
//     "Taxi",
//     "RV",
//     "Ambulance",
//     "Ferry",
//     "Tractor",
//     "Segway",
//     "Spaceship",
//     "Algorithm",
//     "Browser",
//     "Code",
//     "Database",
//     "Firewall",
//     "Hardware",
//     "Software",
//     "Keyboard",
//     "Monitor",
//     "Mouse",
//     "Server",
//     "Wi-Fi",
//     "Encryption",
//     "Cloud",
//     "Programming",
//     "RAM",
//     "URL",
//     "Virus",
//     "Ethernet",
//     "Cache",
//     "Inception",
//     "Titanic",
//     "Jurassic Park",
//     "The Matrix",
//     "Pulp Fiction",
//     "The Avengers",
//     "Interstellar",
//     "Fight Club",
//     "Forrest Gump",
//     "The Shafather",
//     "Star Wawshank Redemption",
//     "The Godrs",
//     "The Dark Knight",
//     "Back to the Future",
//     "Gladiator",
//     "The Lion King",
//     "The Lord of the Rings",
//     "Harry Potter",
//     "Spider-Man",
//     "Toy Story",
//     "Google",
//     "Apple",
//     "Amazon",
//     "Microsoft",
//     "Facebook",
//     "Tesla",
//     "Netflix",
//     "Uber",
//     "Airbnb",
//     "Adobe",
//     "Spotify",
//     "Samsung",
//     "Oracle",
//     "Intel",
//     "Twitter",
//     "IBM",
//     "PayPal",
//     "Snapchat",
//     "Sony",
//     "Reddit"
//   ]
// }
