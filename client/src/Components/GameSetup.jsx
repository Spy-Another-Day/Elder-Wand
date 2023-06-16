import { useEffect, useState, useContext } from "react";
import { SocketContext } from '../socket.js';
import { useUser } from "@clerk/clerk-react";
import { GameStateContext } from '../Components/Context.js'
import IconClose from '../assets/IconClose'

const GameSetup = () => {
  const { user } = useUser();
  const socket = useContext(SocketContext);
  const gameState = useContext(GameStateContext);


  const [modal, setModal] = useState(false);
  const [teamOneMembers, setTeamOneMembers] = useState([]);
  const [teamTwoMembers, setTeamTwoMembers] = useState([]);
  const [undecidedPlayers, setUndecidedPlayers] = useState([]);
  const [hasChosen, setHasChosen] = useState(false)
  const [teamInfo, setTeamInfo] = useState({
    "userID": user.id,
    "user": user.username,
    "team": undefined,
    "role": undefined,
    "change": false
  })
  // NOTE: if a user left the game and come back,
  // his init teamInfo should depend on the gameState

  useEffect(() => {
    console.log(gameState)
    if (gameState.team_1_members && gameState.team_2_members) {
      const result = [[], [], []];

      Object.keys(gameState.team_1_members).forEach(userID => {
        result[0].push([userID, gameState.team_1_members[userID]])
        if (userID === user.id) {
          setTeamInfo({ ...teamInfo, ["team"]: 1 })
        }
      })
      Object.keys(gameState.team_2_members).forEach(userID => {
        result[1].push([userID, gameState.team_2_members[userID]])
        if (userID === user.id) {
          setTeamInfo({ ...teamInfo, ["team"]: 2 })
        }
      })
      Object.keys(gameState.players).forEach(userID => {
        if (gameState.team_1_members[userID] === undefined && gameState.team_2_members[userID] === undefined) {
          result[2].push([userID, gameState.players[userID]])
        }
      })
      setTeamOneMembers(result[0]);
      setTeamTwoMembers(result[1]);
      setUndecidedPlayers(result[2]);
    }
  }, [gameState])

  const handleClickTeam = (num) => {
    console.log(teamInfo.team)
    if (teamInfo.team === undefined) {
      setTeamInfo({ ...teamInfo, ["team"]: num })
      setModal(true)
    }
  }

  const handleClickClose = () => {
    setModal(false)
    setTeamInfo({ ...teamInfo, ["team"]: undefined })
  }

  const getTotalPlayers = () => {
    if (!gameState.players) return 0;
    return Object.values(gameState.players)?.length;
  }

  const readyToStart = () => {
    // each team should have a spymaster
    if (gameState.team_1_spymaster?.length === 0
      || gameState.team_2_spymaster?.length === 0) {
      return false;
    }

    // each team should have at least two players
    if (gameState.team_1_members?.length < 2
      || gameState.team_2_members?.length < 2 ) {
      return false;
    }

    // all players are ready
    if (undecidedPlayers.length > 0) {
      return false;
    }

    return true;
  }

  const handleSwitchTeams = () => {
    const info = { ...teamInfo, ['change']: true}
    setTeamInfo(info)
    socket.emit('updateTeam', gameState.roomID, info)
    setTeamInfo({ ...teamInfo, ['role']: undefined, ['team']: undefined, ['change']: false})
    setHasChosen(false)
  }

  const updateTeamMember = (role) => {
    setModal(false);
    const info = { ...teamInfo, ["role"]: role };
    setTeamInfo(info);
    socket.emit('updateTeam', gameState.roomID, info)
    setHasChosen(true)
  }

  const nextStage = (nextStage) => {
    socket.emit('updateStage', gameState.roomID, nextStage)
  }

  if (!gameState) {
    return (<div>Loading...</div>);
  }

  //  ('gameState in GameSetup:', gameState)

  return (
    <div className="container flex flex-col h-[60%] max-w-6xl mx-auto my-12 px-8">
      <div className="relative block h-2/3 md:flex items-center space-x-8 my-8">

        {/* TEAM 1 */}
        <div onClick={() => {handleClickTeam(1); console.log('asdasdas')}}
          className="relative w-full h-full md:w-1/2 rounded-3xl bg-neutral
        shadow-lg overflow-hidden py-8 cursor-pointer hover:bg-red-500 ">
          <div><h1>Red Team</h1></div>
          <br />
          <div className={`${modal ? "hidden" : ""} flex flex-row`}>
            <div className="w-1/2">
              <h3>Spymaster</h3>
              {gameState.team_1_spymaster?.[1]}
            </div>
            <div className="w-1/2">
              <h3>Field Operative</h3>
              <ul>
                {teamOneMembers.map(player => {
                  if (player[0] === gameState.team_1_spymaster[0]) {
                    return;
                  }
                  return (<li key={player[0]}>{player[1]}</li>)
                })}
              </ul>
            </div>
          </div>

          {/* Choose role Modal*/}
          <div className={`fixed z-10 ${modal ? "" : "hidden"}
          top-0 left-0 right-0 backdrop-blur-lg backdrop-grayscale
          p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
            <div className="relative w-full max-w-lg max-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button type="button"
                onClick={handleClickClose}
                className="absolute top-3 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900
                rounded-lg py-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <IconClose />
              </button>

              <div className="flex flex-nowrap space-x-3 mx-4 h-full w-full">
                {/* Modal content */}
                {teamInfo.team === 1 && gameState.team_1_spymaster?.length === 0 && (
                  <div onClick={() => updateTeamMember("spymaster")}
                    className="w-1/2 bg-primary flex justify-center text-neutral rounded-3xl items-center m-16 p-16">
                    <h3>I want to be a Spy Master</h3>
                  </div>
                )}

                {teamInfo.team === 2 && gameState.team_2_spymaster?.length === 0 && (
                  <div onClick={() => updateTeamMember("spymaster")}
                    className="w-1/2 bg-primary flex justify-center text-neutral rounded-3xl  items-center m-16 p-16">
                    <h3>I want to be a Spy Master</h3>
                  </div>
                )}

                <div onClick={() => updateTeamMember("agent")}
                  className="w-1/2 bg-primary flex justify-center text-neutral rounded-3xl items-center m-16 p-16">
                  <h3>I want to be a Field Operative</h3>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* TEAM 2 */}
        <div onClick={() => handleClickTeam(2)}
          className={`relative w-full h-full md:w-1/2 rounded-3xl bg-neutral
        shadow-lg overflow-hidden py-8 hover:bg-blue-500 cursor-pointer`}>
          <div><h1>Blue Team</h1></div>
          <br />
          <div className={`${modal ? "hidden" : ""} flex flex-row `}>
            <div className="w-1/2">
              <h3>Spymaster</h3>
              {gameState.team_2_spymaster?.[1]}
            </div>
            <div className="w-1/2">
              <h3>Field Operative</h3>
              <ul>
                {teamTwoMembers.map(player => {
                  if (player[0] === gameState.team_2_spymaster[0]) {
                    return;
                  }
                  return (<li key={player[0]}>{player[1]}</li>)
                })}
              </ul>
            </div>
          </div>

        </div>

      </div>

      <div>
        <div>

          <br />
          {undecidedPlayers.length > 0 && (
            <div className="text-neutral bg-primary rounded-lg ">
              Undecided {undecidedPlayers.length} / {getTotalPlayers()}
              <br />
              waiting on
              <br />
              {undecidedPlayers.map((player) => {
                return (
                  <span key={player[0]}>{player[1]} </span>
                )
              })}
            </div>
          )}
          {hasChosen ? <button onClick={(e)=>{e.preventDefault(); handleSwitchTeams()}}>switch teams</button> : null}

          {undecidedPlayers.length === 0 && (
            <div className="flex flex-col">
              <p className="text-neutral bg-primary">All players are ready...</p>
            </div>
          )}


        </div>
      </div>


      {readyToStart() && socket.id === gameState.host && (
        <button onClick={() => nextStage("play")}>Start</button>
      )}


    </div>
  );
}


export default GameSetup;