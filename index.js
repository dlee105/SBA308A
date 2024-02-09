import {
  initialTeamLoad as load,
  clearTeamOption,
  clearDivisionSelect,
  buildTeamOption,
  filterDivisionOptions,
  clearPlayerOption,
} from "./helper.js";

import { NBA_CODE } from "./features.js";

import axios from "axios";

let data_for_upload = [];

const ENDPOINT = "https://api.sportsdata.io/v3/nba/scores/json/PlayersBasic/";
const API_KEY = "0b3cc34d6a6c452694e50ba78ab704b7";

// async function test() {
//   await axios
//     .get(ENDPOINT + "LAL?key=" + API_KEY)
//     .then((response) => console.log(response.data))
//     .catch((error) => console.log(error));
// }
// test();

export let conferenceSelectorEl = document.getElementById("conference-select");
export let divisionsSelectorEl = document.getElementById("divisions-select");
export let teamSelectorEl = document.getElementById("team-select");
export let playerSelectorEl = document.getElementById("player-select");
export let addPlayerButtonEl = document.getElementById("add-player-button");
export let cardContainerEl = document.getElementById("card-container");

addPlayerButtonEl.addEventListener("click", (e) => {
  console.log(data_for_upload);
  console.log(playerSelectorEl.value);

  for (const playerObj of data_for_upload) {
    if (playerSelectorEl.value == playerObj["PlayerID"]) {
      let teamColor = NBA_CODE[playerObj["Team"]].colors;
      let teamLogo = NBA_CODE[playerObj["Team"]].logo_url;
      let newPlayerCard = document.createElement("div");
      newPlayerCard.classList.add("player-card");
      newPlayerCard.style.backgroundColor = `${teamColor[0]}`;
      let logoImg = document.createElement("img");
      logoImg.setAttribute("src", teamLogo);
      logoImg.setAttribute("alt", NBA_CODE[playerObj["Team"]].name);
      logoImg.style.scale = ".2";
      logoImg.style.position = "sticky";
      logoImg.style.top = "0";

      let playerName = document.createElement("h5");
      playerName.innerText =
        playerObj["FirstName"] + " " + playerObj["LastName"];

      newPlayerCard.appendChild(logoImg);
      newPlayerCard.appendChild(playerName);
      // newPlayerCard.innerText = `${
      //   playerObj["FirstName"] + " " + playerObj["LastName"]
      // }`;
      //Append new card to view;

      cardContainerEl.appendChild(newPlayerCard);
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
  console.log(e.target.value, conferenceSelectorEl.value);
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
    console.log(teamSelectorEl.value);
    data_for_upload = [];
    await axios
      .get(ENDPOINT + `${teamSelectorEl.value}?key=` + API_KEY)
      .then((response) => {
        for (let playerObj of response.data) {
          data_for_upload.push(playerObj);
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
