# Skill-Based Assessment 308A
This is an NBA based card collection using API calls from api.sportsdata.io & storing these data
within a google sheet API platform called sheetdb.io
## How It Works
The overall functionalities of this website is pretty simple!
Given three main dropdown selectors: 

> conferenceSelectorEl
> divisionsSelectorEl
> teamSelectorEl
 - The conference selector is the first selector that will filter out the teamSelectorEl team options to match the which conference is selected; 
 - Similarily, the divisions selector is also filtered by the conference selected option and will display which divisions is available inside the conference
 - Lastly the options of team selector is decided each time one of the selector above is changed, when selected, the player selector will get out of its disabled state and extracts the player information from api.sportsdata.io and display them within the playerSelectorEl
## Other Files
There are a total of three .js files each with its own responsibilities.
To keep the code clean and readible, 
 - helper.js contains general functions that builds the selector as well as cards through the use of DOM
 - tools.js contains constant data I've created to help limit the use of API (due to quota limit and I WONT PAY) that helps with information filtering selector and styling each cards. I also store my API informations here
 - index.js is the primary file that handles loading the page with information from SheetDB.io as well as give functionalities and logic to the webpage with eventListener
## How to use
> **INSTALLATION**
> 1. Fork the following project or download it as a .zip onto your local machine
> 2. cd into the primary folder containing both index.html and index.js
> 3. run the command npm install
> 4. start the liveserver inside vscode
> 5. NOW YOU CAN USE THE WEBSITE

The website will display cards based on the information given from SheetDB.io and these information are all from the following csv/googleSheet file (check the link below to see which player card will be displayed)
 [Google Sheet](https://docs.google.com/spreadsheets/d/1ZR2bh41uwJb869lPEsrU1t3hLtYM_G5pBxIKqUUotHU/edit?usp=sharing) 
1. When first load up the webpage index.js will handle getting players
   information from the googlesheet file and then display them on the
   website 
 2. To add or find specific players, I recommend selecting a    specific
    option from the three main selectors to easily find your    desired
    team
 3. When a team is selected, you can choose a player from
   the player selector
   4. Click the "add player" button to add through **POST** this player into the SheetDB if the request is successful, the webpage will create a player card with the selected player's information and display it on the webpage.
   5. To remove a card, click on the (TRASH ICON) and this will prompt a window message that required a confirmation to remove the card. If clicked accept, index.js will make an API **DELETE** request to SheetDB and on success, the page will be updated with the removed card and sheetDB remove that player information from the csv

