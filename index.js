import {
  initialTeamLoad as load,
  clearDivisionSelect,
  buildTeamOption,
  filterDivisionOptions,
  clearPlayerOption,
  buildPlayerCard,
} from "./helper.js";

import { NBA_CODE } from "./tools.js";

// const fs = require("fs");

import axios from "axios";

let TEAM_PLAYER_DATA = [];

const ENDPOINT = "https://api.sportsdata.io/v3/nba/scores/json/PlayersBasic/";
const API_KEY = "0b3cc34d6a6c452694e50ba78ab704b7";
const SHEET_API_KEY = "845ycti0p977xe5tid2o2vjnkq5eh0zhv07fztws";
const SHEET_ENDPOINT = "https://sheetdb.io/api/v1/zp4djpgp3onkb";

async function loadPage() {
  // const csvFile = fs.readFileSync("./src/test.csv", "utf-8");
  // console.log(csvFile);
  // var results = Papa.parse("./src/test.csv");
  // console.log(results.meta.delimiter);
  await axios
    .get(SHEET_ENDPOINT + "?key=" + SHEET_API_KEY)
    .then((response) => {
      // console.log(response.data);
      buildPlayerCard(response.data[0]);
    })
    .catch((error) => console.log(error));
}
// loadPage();

async function postPlayer(playerObj) {
  let header = {
    PlayerID: playerObj.PlayerID,
    TeamID: playerObj.TeamID,
    Team: playerObj.Team,
    Jersey: playerObj.Jersey,
    PositionCategory: playerObj.PositionCategory,
    Position: playerObj.Position,
    FirstName: playerObj.FirstName,
    LastName: playerObj.LastName,
    BirthDate: playerObj.BirthDate,
    Height: playerObj.Height,
    Weight: playerObj.Weight,
  };
  console.log(header);
  await axios
    .post(SHEET_ENDPOINT + "?key=" + SHEET_API_KEY, header)
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
}

export let conferenceSelectorEl = document.getElementById("conference-select");
export let divisionsSelectorEl = document.getElementById("divisions-select");
export let teamSelectorEl = document.getElementById("team-select");
export let playerSelectorEl = document.getElementById("player-select");
export let addPlayerButtonEl = document.getElementById("add-player-button");
export let cardContainerEl = document.getElementById("card-container");

addPlayerButtonEl.addEventListener("click", (e) => {
  for (const playerObj of TEAM_PLAYER_DATA) {
    if (playerSelectorEl.value == playerObj["PlayerID"]) {
      postPlayer(playerObj);
      buildPlayerCard(playerObj);
    }
  }
});

/////////////////////////////
// THIS WILL ONLY RUN ONCE //
load(); //////////////////////
/////////////////////////////
/////////////////////////////

conferenceSelectorEl.addEventListener("change", (e) => {
  clearDivisionSelect();
  buildTeamOption(conferenceSelectorEl.value, divisionsSelectorEl.value);
  filterDivisionOptions(e.target.value);
});

divisionsSelectorEl.addEventListener("change", (e) => {
  //console.log(e.target.value, conferenceSelectorEl.value);
  buildTeamOption(conferenceSelectorEl.value, divisionsSelectorEl.value);

  // const currentDivisionOptions =
});

teamSelectorEl.addEventListener("change", async (e) => {
  //console.log(teamSelectorEl.value, teamSelectorEl.value !== "default");

  if (teamSelectorEl.value === "default") {
    playerSelectorEl.setAttribute("disabled", "");
    playerSelectorEl.firstElementChild.innerText =
      "Required Valid Team Selection";
  } else {
    playerSelectorEl.removeAttribute("disabled");
    playerSelectorEl.firstElementChild.innerText = "Select Players";
    clearPlayerOption();
    //console.log(teamSelectorEl.value);
    TEAM_PLAYER_DATA = [];
    await axios
      .get(ENDPOINT + `${teamSelectorEl.value}?key=` + API_KEY)
      .then((response) => {
        for (let playerObj of response.data) {
          TEAM_PLAYER_DATA.push(playerObj);
          let playerOption = document.createElement("option");

          playerOption.setAttribute("value", playerObj["PlayerID"]);
          playerOption.innerText =
            playerObj["FirstName"] +
            " " +
            playerObj["LastName"] +
            " | #" +
            playerObj["Jersey"];
          //console.log(playerOption);
          playerSelectorEl.appendChild(playerOption);
        }
      })
      .catch((error) => console.log(error));
  }
});

playerSelectorEl.addEventListener("change", (e) => {});
