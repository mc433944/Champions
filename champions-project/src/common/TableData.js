import React from 'react';

const TableData = (props) => {
  const {title, teamResults} = props
  console.log("TeamResults:", teamResults);

  return (
    <div>
      <h1>{title}</h1>
      <table cellSpacing={0} cellPadding={15} className="Table-Style">
        <thead>
          <tr>
            <th>Group</th>
            <th>Ranking</th>
            <th>Team Name</th>
            <th>Registration Date</th>
            <th>Points</th>
            <th>Alternate Points</th>
            <th>Goals</th>
          </tr>
        </thead>
        <tbody>
          {teamResults.map((team, i) => {
            
            return (
              <tr key={i}>
                <td>{team.groupNum}</td>
                <td>{teamResults.length > 8 ? (i%6)+1 : (i%4)+1}</td>
                {/* <td>{(i%4)+1}</td> */}
                <td>{team.name}</td>
                <td>{team.date}</td>
                <td>{team.points}</td>
                <td>{team.alternatePoints}</td>
                <td>{team.goals}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
      
    </div>
  ) 
}

export default TableData;