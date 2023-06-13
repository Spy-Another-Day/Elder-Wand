import { useEffect, useState, useContext } from "react";

const GameSetup = ({ nextStage, gameState }) => {
  // const socket = useContext(SocketContext);

  // const [players, setPlayers] = useState({});
  // const [teamMembers, setTeamMembers] = useState(
  //   [[], []]);

  // const [assignments, setAssignments] = useState([0, 0]);


  // useEffect(() => {
  //   setPlayers(gameState.players);
  //   setTeamMembers([gameState.team_1_members, gameState.team_1_member]);
  //   console.log('inside use effect', gameState)
  // }, [gameState])


  const getTotalPlayers = () => {
    if (!gameState.players) return 0;
    return Object.values(gameState.players)?.length;
  }

  const getTotalUnassigned = () => {
    if (!gameState.team_1_member) return 0;
    return getTotalPlayers - gameState.team_1_member?.length - gameState.team_2_member?.length;
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  console.log(gameState)

  return (
    <div className="container flex flex-col h-5/6 max-w-6xl mx-auto my-12 px-8">
      <div className="relative block h-2/3 md:flex items-center space-x-8 my-8">
        <div className="relative w-full h-full md:w-1/2 rounded bg-neutral shadow-lg overflow-hidden py-8">
          <div><h1>Red Team</h1></div>
          <div className="flex flex-row">
            <div className="w-1/2">
              <h3>Spymaster</h3>
              {gameState.team_1_spymaster}
            </div>
            <div className="w-1/2">
              <h3>Field Operative</h3>
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
            console.log('here')
            return (
              <span key={idx}>{player} </span>
            )
          })}
        </div>
      </div>

      {getTotalUnassigned() === getTotalPlayers() && (
        <button onClick={() => nextStage("init")}>Start</button>
      )}

    </div>
  );
}

export default GameSetup;