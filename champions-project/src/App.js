import logo from './logo.svg';
import './App.css';
import InputBox from './common/InputBox';
import React, { useState } from 'react';

//labelTitle, text, handleSubmit, handleChange
function App() {
  const [teams, setTeams] = useState("");
  const [matchResults, setMatchResults] = useState("");

  const [submittedTeams, setSubmittedTeams] = useState([]);
  const [submittedMatchResults, setSubmittedMatchResults] = useState([]);

  const [winningTeams, setWinningTeams] = useState([]);

  const [errMsg, setErrMsg] = useState("");

  const doTeamUpdate = (event) => {
    console.log("DoTeamUpdateTeams:",{...teams.replaceAll("\n"," ").split(" ").slice(0, -1)});
    let isValidData = true;
    const teamElementArr = [...teams.replaceAll("\n"," ").split(" ").slice(0, -1)];
    const teamInformationArr = [];
    for(var i = 0; i < Object.keys(teamElementArr).length; i+=3) {
      const currTeam = {
        name: teamElementArr[i],
        date: teamElementArr[i+1],
        groupNum: Number(teamElementArr[i+2]),
        points: 0,
        goals: 0,
        alternatePoints: 0,
      }

      const dateElements = currTeam.date.split("/");
      const isDateInvalid = (Number(dateElements[0]) !== Number(dateElements[0])) || (Number(dateElements[1]) !== Number(dateElements[1]));

      if(isDateInvalid) {
        isValidData = false;
        console.log("NAN is called");
        setErrMsg("Please ensure dates entered for Team Information are in the following format: DD/MM")
        break;
      }
      console.log("a[0]:", Number(currTeam.name));
      console.log("a[0]:", typeof currTeam.points);
      teamInformationArr.push(currTeam);
    }

    console.log("teamInfoArr:",teamInformationArr);
    ////
    const updatedTeamScore = [...teamInformationArr];

    const matchElementArr = [...matchResults.replaceAll("\n"," ").split(" ").slice(0, -1)];
    const matchResultsArr = [];
    for(var i = 0; i < Object.keys(matchElementArr).length && isValidData; i+=4) {
      const currMatch = {
        baseName: matchElementArr[i],
        opponentName: matchElementArr[i+1],
        baseGoal: Number(matchElementArr[i+2]),
        opponentGoal: Number(matchElementArr[i+3]),
      }
      matchResultsArr.push(currMatch);

      const isGoalInvalid = (currMatch.baseGoal !== currMatch.baseGoal) || (currMatch.opponentGoal !== currMatch.opponentGoal);

      if(isGoalInvalid) {
        isValidData = false;
        console.log("NAN is called");
        setErrMsg("Please ensure goals entered in Match Results are numbers.")
        break;
      }
      
      const baseTeamToBeUpdated = updatedTeamScore.find(team => team.name === currMatch.baseName);
      const opponentTeamToBeUpdated = updatedTeamScore.find(team => team.name === currMatch.opponentName);
      if(!!baseTeamToBeUpdated && !!opponentTeamToBeUpdated) {
        if(currMatch.baseGoal >= currMatch.opponentGoal) {
          if(currMatch.baseGoal === currMatch.opponentGoal) {
          
            baseTeamToBeUpdated.points += 1;
            baseTeamToBeUpdated.goals += currMatch.baseGoal;
            baseTeamToBeUpdated.alternatePoints += 3;

            opponentTeamToBeUpdated.points += 1;
            opponentTeamToBeUpdated.goals += currMatch.opponentGoal;
            opponentTeamToBeUpdated.alternatePoints += 3;
          } else {
            baseTeamToBeUpdated.points += 3;
            baseTeamToBeUpdated.goals += currMatch.baseGoal;
            baseTeamToBeUpdated.alternatePoints += 5;

            opponentTeamToBeUpdated.goals += currMatch.opponentGoal;
            opponentTeamToBeUpdated.alternatePoints += 1;
          }
          
        } else {
          baseTeamToBeUpdated.goals += currMatch.baseGoal;
          baseTeamToBeUpdated.alternatePoints += 1;

          opponentTeamToBeUpdated.points += 3;
          opponentTeamToBeUpdated.goals += currMatch.opponentGoal;
          opponentTeamToBeUpdated.alternatePoints += 5;
        }
        // console.log("baseTeamToUpdate:",baseTeamToBeUpdated);
        // console.log("oppTeamToUpdate:",opponentTeamToBeUpdated);
      } else {
        isValidData = false;
        setErrMsg("Please ensure that team name entered in Match Results tallys with Team Information.");
        break;
      }
    }

    if(isValidData){
    const teamOne = [...updatedTeamScore.filter(team => team.groupNum === 1).sort((a,b) => {
      if(a.points === b.points){

        if(a.goals === b.goals){

          if(a.alternatePoints === b.alternatePoints) {
            const aDateArr = a.date.split("/");
            const bDateArr = b.date.split("/");
            return Number(aDateArr[1]) <= Number(bDateArr[1]) ? 
              Number(aDateArr[1]) === Number(bDateArr[1]) ? 
              Number(aDateArr[0]) <= Number(bDateArr[0]) ? -1 : 1 : -1 : 1
          } else {
            return a.alternatePoints > b.alternatePoints ? -1 : 1;
          }

        } else {
          return a.goals > b.goals ? -1 : 1;
        }
      }
      return a.points > b.points ? -1 : 1;
    })];
    const teamTwo = [...updatedTeamScore.filter(team => team.groupNum === 2).sort((a,b) => a.points > b.points ? -1 : 1)];

    const teamsWon = [...teamOne.slice(0, -2), ...teamTwo.slice(0,-2)];
  
    console.log("TeamsWon:",teamsWon);

    for(var k = 0; k < teamOne.length && isValidData; k++) {
      console.log("teamOneArr:",teamOne[k])
    }
          
    console.log("UpdateTemp:",updatedTeamScore);
    console.log("UpdateMatch:",matchResultsArr);

    ////
    setWinningTeams(teamsWon);
    setSubmittedTeams(updatedTeamScore);
    setSubmittedMatchResults(matchResultsArr);
    setErrMsg("");
  }
    event.preventDefault();
  }

  const doTeamOnChange = (event) => {
    setTeams(event.target.value);
  }

  const doMatchResultsOnChange = (event) => {
    setMatchResults(event.target.value);
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {errMsg ? <h3>{errMsg}</h3> : null}
        <h1>length of {submittedTeams.length}</h1>
        {submittedTeams.length > 0 ? <h1>active map</h1>:
          <h1>Please enter 12 teams information:</h1>
        }
        {submittedMatchResults.length > 0 ? <h1>matchResults:{submittedMatchResults.length}</h1>:
          <h1>Please enter 12 teams match results:</h1>
        }
          {winningTeams.map((team, i) => {
            return (
              <div key={i}>
                <h1>{team.name}</h1>
                <h1>{team.date}</h1>
                <h1>{team.groupNum}</h1>
              </div>
            )
          })}
          
        
        <div>
          <form onSubmit={(event) => doTeamUpdate(event)}>
            <div>
              <InputBox 
                labelTitle="Team Information:"
                text={teams}
                // handleSubmit={(event) => doTeamUpdate(event)}
                handleChange={(event) => doTeamOnChange(event)}
              />
            </div>

            <div>
              <InputBox 
                labelTitle="Match results:"
                text={matchResults}
                // handleSubmit={(event) => doTeamUpdate(event)}
                handleChange={(event) => doMatchResultsOnChange(event)}
              />
            </div>
        
            <input type="submit" value="Submit" /> 
          </form>
        </div>
        
      </header>
        
    </div>
  );
}

export default App;
