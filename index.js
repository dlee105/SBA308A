import {
  initialTeamLoad as load,
  clearDivisionSelect,
  buildTeamOption,
  filterDivisionOptions,
  clearPlayerOption,
  buildPlayerCard,
} from "./helper.js";

import {
  NBA_CODE,
  ENDPOINT,
  API_KEY,
  SHEET_API_KEY,
  SHEET_ENDPOINT,
} from "./tools.js";

import axios from "axios";

// ==============================================================================
// PLEASE CONSIDER NOT REFRESHING TOO MUCH AS DATA ARE LOADED FROM AN API WITH LIMITED
// QUOTA CURRENTLY ABOUT 15% OF LIMIT SO TO AVOID WEBSITE BREAKING PLEASE COMMENT OUT
// THE loadSheetDB() FUNCTION AS THIS IS CALLED EVERYTIME THE WEBSITE LOADS UP
// ALSO IF RUN INTO AUTHENTICATION ISSUES PLEASE CONTACT ME FOR A NEW SHEETDB APIKEY :)
// WHERE THE DATA IS ADDED TO: (OPEN THIS GOOGLE SHEET WHILE USING THE WEBSITE TO SEE REALTIME UPDATE)
// https://docs.google.com/spreadsheets/d/1ZR2bh41uwJb869lPEsrU1t3hLtYM_G5pBxIKqUUotHU/edit?usp=sharing
// ==============================================================================

let TEAM_PLAYER_DATA = []; // CONTAINS ALL PLAYER IN THE CURRENT SELECTED TEAM //
let ADDED_PLAYER = []; // SHOULD UPDATE CORRESPONDING TO SHEETDB

// HELPER FUNCTIONS FOR INDEX.JS //
function removePlayerFromList(PlayerID) {
  const idx = ADDED_PLAYER.findIndex((obj) => obj["PlayerID"] === PlayerID);
  ADDED_PLAYER.splice(idx, 1);
  console.log(ADDED_PLAYER);
}
//================================================================================

// DOCUMENT QUERIES ==============================================================
export let conferenceSelectorEl = document.getElementById("conference-select");
export let divisionsSelectorEl = document.getElementById("divisions-select");
export let teamSelectorEl = document.getElementById("team-select");
export let playerSelectorEl = document.getElementById("player-select");
export let addPlayerButtonEl = document.getElementById("add-player-button");
export let cardContainerEl = document.getElementById("card-container");

// API FUNCTIONS =================================================================
// LOADING DATA FROM SHEETDB AND DISPLAY THEM
//GET Request
async function loadSheetDB() {
  await axios
    .get(SHEET_ENDPOINT, {
      headers: { Authorization: `Bearer ${SHEET_API_KEY}` },
    })
    .then((response) => {
      console.log("SUCCESS: Loaded SheetDB");

      for (const player of response.data) {
        // console.log(player);
        ADDED_PLAYER.push(player);
        buildPlayerCard(player);
      }
    })
    .catch((error) => console.log(error));
  console.log(ADDED_PLAYER);
}

// ADDING PLAYER ONTO SHEETDB
// POST request
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
  await axios
    .post(
      SHEET_ENDPOINT,
      {
        header,
      },
      { headers: { Authorization: `Bearer ${SHEET_API_KEY}` } }
    )
    .then((response) => {
      console.log("SUCCESS: Posted", playerObj.PlayerID),
        buildPlayerCard(playerObj);
    })
    .catch((error) => console.log(error));
}

// DELETING PLAYER FROM SHEETDB
// DELETE Reqest
async function removePlayer(playerID) {
  axios
    .delete(SHEET_ENDPOINT + "/PlayerID/" + playerID, {
      headers: { Authorization: `Bearer ${SHEET_API_KEY}` },
    })
    .then((response) => {
      removePlayerFromList(playerID);
      console.log("SUCCESS: Removed", playerID);
    })
    .catch((error) => console.log(error));
}

// WEBPAGE INITIALIZE ============================================================
/////////////////////////////
//THESE WILL ONLY RUN ONCE //
loadSheetDB(); // <== UNCOMMENT THIS TO GET DATA FROM SHEETDB API
//get from SheetDB //////////
load(); /////////////////////
// default for team select //
/////////////////////////////
/////////////////////////////
// removePlayer(20002307);
// ===============================================================================

// EVENT LISTENERS ===============================================================
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

// LOADING PLAYER WHEN A TEAM IS SELECTED FROM api.sportsdata.io //
// GET request
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

window.addEventListener("click", async (e) => {
  if ([...e.target.classList].includes("del-btn")) {
    let pname = e.target.parentNode.innerText.split("\n")[0];
    // console.log(pname);
    if (confirm(`Remove ${pname}?`)) {
      const ID = e.target.parentNode.id;
      removePlayer(ID);
      cardContainerEl.removeChild(document.getElementById(ID));
    }
  }
});

//
addPlayerButtonEl.addEventListener("click", async (e) => {
  for (const playerObj of TEAM_PLAYER_DATA) {
    if (playerSelectorEl.value == playerObj["PlayerID"]) {
      if (!ADDED_PLAYER.find((obj) => obj.PlayerID == playerObj["PlayerID"])) {
        ADDED_PLAYER.push(playerObj);
        postPlayer(playerObj);
      } else {
        alert("No duplicate allowed!");
      }
      break;
    }
  }
  // console.log(ADDED_PLAYER);
});
