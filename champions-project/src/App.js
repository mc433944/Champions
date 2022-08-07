import './App.css';
import InputBox from './common/InputBox';
import TableData from './common/TableData';
import React, { useState } from 'react';

//labelTitle, text, handleSubmit, handleChange
function App() {
  const [teams, setTeams] = useState("");
  const [matchResults, setMatchResults] = useState("");

  const [submittedTeams, setSubmittedTeams] = useState([]);
  const [submittedMatchResults, setSubmittedMatchResults] = useState([]);

  const [finalTeamResults, setFinalTeamResults] = useState([]);
  const [qualifiedTeamsResults, setQualifiedTeamsResults] = useState([]);

  const [errMsg, setErrMsg] = useState("");

  const doTeamUpdate = (event) => {
    console.log("DoTeamUpdateTeams:",{...teams.replaceAll("\n"," ").split(" ").slice(0, -1)});
    let isDataInvalid = false;
    const teamElementArr = [...teams.replaceAll("\n"," ").split(" ").slice(0, -1)];
    const teamInformationArr = [];
    const matchElementArr = [...matchResults.replaceAll("\n"," ").split(" ").slice(0, -1)];
    const matchResultsArr = [];

    if(teamElementArr.length === 0 || matchElementArr.length === 0) {
      isDataInvalid = true;
      setErrMsg("Please provide inputs for both Team Information and Match Results.");
    }

    for(var i = 0; i < Object.keys(teamElementArr).length && !isDataInvalid; i+=3) {
      const currTeam = {
        name: teamElementArr[i],
        date: teamElementArr[i+1],
        groupNum: Number(teamElementArr[i+2]),
        points: 0,
        goals: 0,
        alternatePoints: 0,
      }

      const dateElements = currTeam.date.split("/");
      isDataInvalid = (Number(dateElements[0]) !== Number(dateElements[0])) 
        || (Number(dateElements[1]) !== Number(dateElements[1]))
        || (currTeam.groupNum !== currTeam.groupNum)
        || (currTeam.groupNum !== 1 && currTeam.groupNum !== 2)
        || (currTeam.name.split(" ").length > 1);

      if(isDataInvalid) {
        // isValidData = false;
        console.log("NAN is called");
        setErrMsg("Please ensure inputs given for Team Information explicitly follows the syntax with spaces only between each <>")
        break;
      }
      console.log("a[0]:", Number(currTeam.name));
      console.log("a[0]:", typeof currTeam.points);
      teamInformationArr.push(currTeam);
    }

    console.log("teamInfoArr:",teamInformationArr);
    ////
    const updatedTeamScore = [...teamInformationArr];

    
    for(var n = 0; n < Object.keys(matchElementArr).length && !isDataInvalid; n+=4) {
      const currMatch = {
        baseName: matchElementArr[n],
        opponentName: matchElementArr[n+1],
        baseGoal: Number(matchElementArr[n+2]),
        opponentGoal: Number(matchElementArr[n+3]),
      }
      matchResultsArr.push(currMatch);

      isDataInvalid = (currMatch.baseGoal !== currMatch.baseGoal) 
        || (currMatch.opponentGoal !== currMatch.opponentGoal)
        || (currMatch.baseName.split(" ").length > 1)
        || (currMatch.opponentName.split(" ").length > 1);

      if(isDataInvalid) {
        // isValidData = false;
        console.log("NAN is called");
        setErrMsg("Please ensure that there are no spaces in team names and goals entered are numbers only in Match Results.")
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
        isDataInvalid = true;
        setErrMsg("Please ensure that team name entered in Match Results matches team name in Team Information.");
        break;
      }
    }

    if(!isDataInvalid){
      const teamOne = sortThisArray([...updatedTeamScore.filter(team => team.groupNum === 1)]);
      const teamTwo = sortThisArray([...updatedTeamScore.filter(team => team.groupNum === 2)]);
      const finalUpdatedTeamScore = [...teamOne, ...teamTwo];
      const teamsAdvanced = [...teamOne.slice(0, -2), ...teamTwo.slice(0,-2)];
  
      console.log("TeamsAdvanced:",teamsAdvanced);
          
      console.log("UpdateTemp:",updatedTeamScore);
      console.log("UpdateMatch:",matchResultsArr);


      setFinalTeamResults(finalUpdatedTeamScore);
      setQualifiedTeamsResults(teamsAdvanced);
      setSubmittedTeams(updatedTeamScore);
      setSubmittedMatchResults(matchResultsArr);
      setErrMsg("");
    }
    event.preventDefault();
  }

  const sortThisArray = (arr) => {
    return arr.sort((a,b) => {
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
    });
  }

  const doTeamOnChange = (event) => {
    setTeams(event.target.value);
  }

  const doMatchResultsOnChange = (event) => {
    setMatchResults(event.target.value);
  }

  const resetAll = () => {
    setFinalTeamResults([]);
    setQualifiedTeamsResults([]);
    setSubmittedTeams([]);
    setSubmittedMatchResults([]);
    setMatchResults("");
    setTeams("");
    setErrMsg("");
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
        
        <h1>GovTech Football Championship</h1>
        
          {/* {qualifiedTeamsResults.map((team, i) => {
            return (
              <div key={i}>
                <h1>{team.name}</h1>
                <h1>{team.date}</h1>
                <h1>{team.groupNum}</h1>
                <h3>{team.goals}</h3>
              </div>
            )
          })} */}
          
        
        <div>
          {errMsg ? <h3 className="Error-Message">{errMsg}</h3> : null}
          <form onSubmit={(event) => doTeamUpdate(event)}>

            {submittedTeams.length === 0 ? 
              <div>
                <h3>Please enter 12 Team Information in the following syntax:</h3>
                <h6>{"<"}Team A name{">"} {"<"}Team A registration date in DD/MM{">"} {"<"}Team A group number{">"}</h6>
              </div>
              :
              null
            }
       
            <InputBox 
              labelTitle="Team Information: "
              text={teams}
              handleChange={(event) => doTeamOnChange(event)}
            />



            {submittedMatchResults.length === 0 ?
              <div>
                <h3>Please enter 12 Match Results in the following syntax:</h3>
                <h6>{"<"}Team A name{">"} {"<"}Team B name{">"} {"<"}Team A goals scored{">"} {"<"}Team B goals scored{">"}</h6>
              </div>
              :
              null
            }

            <InputBox 
              labelTitle="Match results: "
              text={matchResults}
              handleChange={(event) => doMatchResultsOnChange(event)}
            />

        
            <input type="submit" value="Submit" /> 
          </form>
          <button onClick={() => resetAll()}>Reset</button>
          <hr />
          <TableData title="Qualified Teams" teamResults={qualifiedTeamsResults} />
          <TableData title="All Teams" teamResults={finalTeamResults} />
        </div>
        
      </header>
        
    </div>
  );
}

export default App;
