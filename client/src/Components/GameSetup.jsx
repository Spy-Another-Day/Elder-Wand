import { useEffect, useState, useContext } from "react";
import { SocketContext } from '../socket.js';
import { useUser } from "@clerk/clerk-react";
import { GameStateContext } from '../Components/Context.js'

const GameSetup = ({ nextStage }) => {
  const { user } = useUser();
  const socket = useContext(SocketContext);
  const [modal, setModal] = useState(false);
  const gameState = useContext(GameStateContext);

  const getTotalPlayers = () => {
    if (!gameState.players) return 0;
    return Object.values(gameState.players)?.length;
  }

  const getTotalUnassigned = () => {
    if (!gameState.team_1_member) return 0;
    return getTotalPlayers - gameState.team_1_member?.length - gameState.team_2_member?.length;
  }

  const updateTeamMember = (userID, team, role) => {
    // console.log('User chooses a team: ', {userID, team, role})
    // socket.emit('updateTeam', {userID, team, role})
  }

  if (!gameState) {
    return (<div>Loading...</div>);
  }

  // console.log('gameState:', gameState)

  return (
    <div className="container flex flex-col h-5/6 max-w-6xl mx-auto my-12 px-8">
      <div className="relative block h-2/3 md:flex items-center space-x-8 my-8">
        <div onClick={() => setModal(true)}
          className="relative w-full h-full md:w-1/2 rounded bg-neutral
        shadow-lg overflow-hidden py-8">
          <div><h1>Red Team</h1></div>
          <div className={`${modal ? "hidden" : ""} flex flex-row`}>
            <div className="w-1/2">
              <h3>Spymaster</h3>
              {gameState.team_1_spymaster}
            </div>
            <div className="w-1/2">
              <h3>Field Operative</h3>
            </div>
          </div>
          <div className={`${modal ? "" : "hidden"} flex flex-nowrap space-x-3 mx-4 h-2/3`}>
            <div onClick={() => updateTeamMember(user.username, 1, "spymaster")}
            className="w-1/2 bg-primary flex justify-center items-center">
              <h3>I want to be a Spy Master</h3>
            </div>
            <div onClick={() => updateTeamMember(user.username, 1, "agent")}
            className="w-1/2 bg-primary flex justify-center items-center">
              <h3>I want to be a Field Operative</h3>
            </div>
          </div>


        </div>

        <div className="w-full h-full md:w-1/2 relative rounded bg-neutral shadow-lg overflow-hidden py-8">
          <h1>Blue Team</h1>
        </div>

      </div>

      <div>
        <div>
          Undecided {getTotalUnassigned()} / {getTotalPlayers()}
          <br />
          waiting on
          <br />
          {gameState.players && Object.values(gameState.players).map((player, idx) => {
            return (
              <span key={idx}>{player} </span>
            )
          })}
        </div>
      </div>

      <button onClick={() => nextStage("init")}>Start</button>

      {/* {getTotalUnassigned() === getTotalPlayers() && (
        <button onClick={() => nextStage("init")}>Start</button>
      )} */}

    </div>
  );
}


export default GameSetup;