import react, {useEffect, useState, userRef, useContext} from 'react';

export default function Record({record}) {


  const {team_1_guessed, team_2_guessed, team_1_members, team_2_members, team_1_spymaster, team_2_spymaster, words, roomID, startUpTeam, teamWon, topic, createdAt, _id, team_1, team_2, team_1_score, team_2_score, winReason, winner_score} = record;


return(<>


<div className="collapse bg-base-200">
  <input type="checkbox" />

  <div className="collapse-title text-xl font-medium">
    <div className="drawer">
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex flex-col">
      {/* Navbar */}
      <div className="w-full navbar bg-base-300">

        <div className="flex-1 px-2 mx-2">{teamWon}: {winner_score}</div>
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

  <div className="flex flex-col w-full lg:flex-row bg-neutral">
    <div className="grid flex-grow  card  rounded-box place-items-center text-base-100 bg-primary">
    <div>
      <h1>Team {team_1}</h1>

      {startUpTeam === team_1 ? '(Start up team)': ''}
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
          <th className='text-base-100' >{team_1}'s Members</th>
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

    <div className="grid flex-grow  card bg-neutral rounded-box place-items-center">
    <div><a>Topic: {topic}</a></div>
      <div className="absolute inset-y-0 right-0 ">
      <a>room id: {roomID}</a>

      </div>


      <div className="bg-red-700 flex flex-col items-center ">
      {
        words.map(row => {
        return (<div className="bg-neutral flex flex-row justify-center w-min">
        {row.map((card) => {
          return (
            <div
              className={`btn m-1 w-40 h-24 ${
                card.belongsTo === 'assassin'
                ? 'btn-warning'
                : card.belongsTo === 'bystander'
                ? 'btn-accent'
                : card.belongsTo === 'team_1'
                ? 'btn-primary'
                : card.belongsTo === 'team_2'
                ? 'btn-secondary'
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
      <h1 className='text-base-100'>Win by: {winReason}</h1>
    </div>

    <div className="grid flex-grow card rounded-box place-items-center bg-secondary">
      <div>
        <h1>Team {team_2}</h1>
        <h2>{startUpTeam === team_2 ? '(Start up team)': ''}</h2>
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
