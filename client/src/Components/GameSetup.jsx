import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../socket.js";


const GameSetup = ({ nextStage, gameState }) => {
  const socket = useContext(SocketContext);

  const [players, setPlayers] = useState({});
  const [teamMembers, setTeamMembers] = useState(
    [[], []]);


  useEffect(() => {
    setPlayers(gameState.players);
    setTeamMembers([gameState.team_1_members, gameState.team_1_member]);
    console.log('inside use effect', gameState)
  }, [gameState])


  const getTotalPlayers = () => {
    if (!players) return 0;
    return Object.values(players)?.length;
  }

  const getTotalUnassigned = () => {
    getTotalPlayers - teamMembers[0]?.length - teamMembers[1]?.length;
  }

  return (
    <div className="container flex flex-col h-5/6 max-w-6xl mx-auto my-12 px-8">
      <div className="relative block h-2/3 md:flex items-center space-x-8 my-8">
        <div className="w-full h-full md:w-1/2 relative rounded bg-neutral shadow-lg overflow-hidden py-8">
          <h1>Red Team</h1>

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
          {players && Object.values(players).map((player, idx) => {
            console.log('here')
            return (
              <span key={idx}>{player} </span>
            )
          })}
        </div>
      </div>
      <button onClick={() => nextStage("init")}>Next</button>
    </div>
  );
}

export default GameSetup;