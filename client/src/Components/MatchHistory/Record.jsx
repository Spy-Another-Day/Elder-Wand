import react, {useEffect, useState, userRef, useContext} from 'react';

export default function Record({record}) {


  const {team_1_guessed, team_2_guessed, team_1_members, team_2_members, team_1_spymaster, team_2_spymaster, words, roomID, startUpTeam, teamWon, topic, createdAt, _id, team_1, team_2, team_1_score, team_2_score, winReason} = record;


return(<>


<div className="collapse bg-base-200">
  <input type="checkbox" />

  <div className="collapse-title text-xl font-medium">
    <div className="drawer">
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex flex-col">
      {/* Navbar */}
      <div className="w-full navbar bg-base-300">

        <div className="flex-1 px-2 mx-2">{teamWon}: {team_1 === teamWon ? team_1_guessed : team_2_guessed}</div>
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal">
            {/* Navbar menu content here */}
            <li><a>{createdAt}</a></li>
            <li><a>game id: {_id}</a></li>
          </ul>
        </div>
      </div>
    </div>


  </div>

  </div>



  <div className="collapse-content">

  <div className="flex flex-col w-full lg:flex-row bg-info">
    <div className="grid flex-grow  card  rounded-box place-items-center bg-info">
    <div>
      <h1>Team {team_1}</h1>

      {startUpTeam === team_1 ? '(team guess first)': '(team guess second)'}
    </div>
    <div>
      {teamWon === team_1 ? (<div>Win</div>) :(<div>Lose</div>) }
    </div>

    <div>
      <div>Score: {team_1_score}</div>
      <div>
        code guessed: {team_1_guessed}
      </div>

    </div>

    <div className="overflow-x-auto">
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>{team_1}'s Members</th>
        </tr>
      </thead>
      <tbody>
        {
          team_1_members.map(member => (
        <tr>
          <td>
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-bold">{member === team_1_spymaster ? member + ' (spymaster)' : member}</div>
                {/* <div className="text-sm opacity-50">United States</div> */}
              </div>
            </div>
          </td>
        </tr>
          ))
        }
      </tbody>

    </table>
  </div>

    </div>

    <div className="grid flex-grow  card bg-base-300 rounded-box place-items-center">
    <div><a>Topic: {topic}</a></div>
      <div className="absolute inset-y-0 right-0 ">
      <a>room id: {roomID}</a>

      </div>


      <div className="bg-red-700 flex flex-col items-center ">
      {
        words.map(row => {
        return (<div className="bg-blue-700 flex flex-row justify-center w-min">
        {row.map((card) => {
          return (
            <div
              onClick={(event) => {console.log(event.target.innerText, 'was clicked')}}
              className={`btn m-1 w-40 h-24 ${
                card.belongsTo === 'assassin'
                ? 'btn-secondary'
                : card.belongsTo === 'bystander'
                ? 'btn-warning'
                : card.belongsTo === 'team_1'
                ? 'btn-info'
                : card.belongsTo === 'team_2'
                ? 'btn-success'
                : 'btn-neutral'}
                `}
            >
              {card.word}
            </div>

          )
        })}
       </div>)

        })
      }
      </div>
      <h1>Win by: {winReason}</h1>
    </div>

    <div className="grid flex-grow  card  rounded-box place-items-center bg-success">
      <div>
        <h1>Team {team_2}</h1>
        <h2>{startUpTeam === team_2 ? '(team guess first)': '(team guess second)'}</h2>
        </div>
        <div>
      {teamWon === team_2 ? (<div>Win</div>) :(<div>Lose</div>) }
    </div>

    <div>
      <div>Score: {team_2_score}</div>
      <div>
        code guessed: {team_2_guessed}
      </div>

    </div>

    <div className="overflow-x-auto">
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>{team_2}'s Members</th>
        </tr>
      </thead>
      <tbody>
        {
          team_2_members.map(member => (
        <tr>
          <td>
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-bold">{member === team_2_spymaster ? member + ' (spymaster)' : member}</div>
                {/* <div className="text-sm opacity-50">United States</div> */}
              </div>
            </div>
          </td>
        </tr>
          ))
        }




      </tbody>


    </table>
  </div>
    </div>
  </div>
  </div>
</div>





</>)
}