import {
  NBA_CODE,
  EAST_DIVISIONS,
  WEST_DIVISIONS,
  ALL_DIVISIONS,
} from "./tools.js";
import * as Element from "./index.js";

export const initialTeamLoad = () => {
  for (const key of Object.keys(NBA_CODE)) {
    //console.log(key, NBA_CODE[key].name);
    let teamOption = document.createElement("option");
    teamOption.setAttribute("value", key);
    teamOption.innerText = NBA_CODE[key].name;
    Element.teamSelectorEl.appendChild(teamOption);
  }
};

function uppercaseFirst(str) {
  // helper
  return str[0].toUpperCase() + str.slice(1);
}

export const clearTeamOption = () => {
  const l = Element.teamSelectorEl.children.length;
  for (let i = l - 1; i >= 1; i--) {
    // console.log(i, divisionsSelectorEl.children[i]);
    Element.teamSelectorEl.children[i].remove();
  }
};

export function clearDivisionSelect() {
  // console.log(divisionsSelectorEl.children.length);
  const l = Element.divisionsSelectorEl.children.length;
  for (let i = l - 1; i >= 1; i--) {
    // console.log(i, divisionsSelectorEl.children[i]);
    Element.divisionsSelectorEl.children[i].remove();
  }
}

export function filterDivisionOptions(conference) {
  //
  if (conference === "all") {
    for (let d of Object.keys(ALL_DIVISIONS)) {
      let child = document.createElement("option");
      child.setAttribute("value", d);
      child.innerText = ALL_DIVISIONS[d];
      Element.divisionsSelectorEl.appendChild(child);
    }
  } else if (conference === "east") {
    for (let d of Object.keys(EAST_DIVISIONS)) {
      let child = document.createElement("option");
      child.setAttribute("value", d);
      child.innerText = EAST_DIVISIONS[d];
      Element.divisionsSelectorEl.appendChild(child);
    }
  } else if (conference === "west") {
    for (let d of Object.keys(WEST_DIVISIONS)) {
      let child = document.createElement("option");
      child.setAttribute("value", d);
      child.innerText = WEST_DIVISIONS[d];
      Element.divisionsSelectorEl.appendChild(child);
    }
  }
}

export function buildTeamOption(conference, division) {
  clearTeamOption();
  const c = uppercaseFirst(conference);
  const d = uppercaseFirst(division);
  //inner helper
  const buildChild = (key) => {
    let team = document.createElement("option");
    team.setAttribute("value", key);
    team.innerText = NBA_CODE[key].name;
    Element.teamSelectorEl.appendChild(team);
  };

  // console.log(c, d);
  for (const key of Object.keys(NBA_CODE)) {
    let objC = NBA_CODE[key].conference;
    let objD = NBA_CODE[key].division;
    if (objC === c && objD === d) {
      buildChild(key);

      //   Element.teamSelectorEl.appendChild();
    } else {
      if (c == "All" && d == objD) {
        buildChild(key);
      }
      if (c == objC && d == "All") {
        buildChild(key);
      }
      if (c == "All" && d == "All") {
        initialTeamLoad();
      }
    }
  }
}

export const clearPlayerOption = () => {
  const l = Element.playerSelectorEl.children.length;
  for (let i = l - 1; i >= 1; i--) {
    // console.log(i, divisionsSelectorEl.children[i]);
    Element.playerSelectorEl.children[i].remove();
  }
};

// Fixed Bug Where Reload Button Doesn't Reset The Content
// {DO LATER}
if (window.performance) {
  console.info("window.performance works fine on this browser");
}
console.info(performance.navigation.type);
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  console.info("This page is reloaded");
} else {
  console.info("This page is not reloaded");
  location.reload();
}

export function buildPlayerBody(json) {
  let docFrag = document.createDocumentFragment("");
  let jersey = document.createElement("h3");
  jersey.innerText = "#" + json["Jersey"];
  let position = document.createElement("p");
  position.innerText = json["Position"];
  let heightWeight = document.createElement("p");
  heightWeight.innerText =
    "Height: " +
    json["Height"] +
    " inches | " +
    "Weight: " +
    json["Weight"] +
    " pounds";
  let age = document.createElement("p");
  age.innerText =
    "Age: " + calculateAge(new Date(), json["BirthDate"].split("T")[0]);

  docFrag.appendChild(jersey);
  docFrag.appendChild(position);
  docFrag.appendChild(heightWeight);
  docFrag.appendChild(age);

  return docFrag;
}

export function buildPlayerCard(playerObj) {
  // console.log(NBA_CODE);
  let teamColor = NBA_CODE[playerObj["Team"]].colors;
  let teamLogo = NBA_CODE[playerObj["Team"]].logo_url;
  let newPlayerCard = document.createElement("div");
  newPlayerCard.classList.add("player-card");
  newPlayerCard.style.backgroundColor = `${teamColor[1]}`;
  newPlayerCard.style.borderColor = `${teamColor[0]}`;
  newPlayerCard.style.color = teamColor[0];

  let logoImg = document.createElement("img");
  let cardHeader = document.createElement("div");
  cardHeader.style.backgroundColor = `${teamColor[0]}`;
  cardHeader.classList.add("pcard-header");
  cardHeader.style.borderBottomColor = `${teamColor[0]}`;

  logoImg.setAttribute("src", teamLogo);
  logoImg.setAttribute("alt", NBA_CODE[playerObj["Team"]].name);
  logoImg.classList.add("pcard-img");

  cardHeader.appendChild(logoImg);
  let playerName = document.createElement("h4");
  playerName.innerText = playerObj["FirstName"] + " " + playerObj["LastName"];
  playerName.classList.add("pt-5");
  newPlayerCard.appendChild(cardHeader);
  newPlayerCard.appendChild(playerName);
  newPlayerCard.appendChild(buildPlayerBody(playerObj));
  Element.cardContainerEl.appendChild(newPlayerCard);
}

function calculateAge(thisYr, birthYr) {
  // console.log(thisYr, new Date(birthYr));
  // console.log(Math.floor((thisYr - new Date(birthYr)) / 31536000000));
  return "Age:", Math.floor((thisYr - new Date(birthYr)) / 31536000000);
}
