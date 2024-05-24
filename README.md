# PeekSeek!

## Project Goal & Motivation
PeekSeek transforms travel planning into a fun, gamified exploration! This interactive game allows players to virtually explore various destinations on Google Maps while competing with friends. Players choose a city they might want to visit and complete multiple quests by finding specific locations in that city, such as landmarks or brunch spots. At the end of the game, all locations are marked on the city map, giving a sense of an itinerary. This makes travel planning more enjoyable and less stressful, ensuring your trip actually happens!

## Technologies
- React
- Javascript
- Typescript
- Tailwind CSS
- Next UI
- Google JavaScript API
- Google Geocoding API
- Google Static Image API

## High-level components
Below are the main frontend components:  

### Lobby ([Lobby.tsx](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/main/src/components/views/Lobby.tsx))
The Lobby  serves as the entry point of the game, where the admin configures the game settings while players join in. Real-time notifications alert players when others join or leave the lobby and when the game settings are updated. Updating the settings publishes game information (time per round, destination and quests) to all players, allowing them to see all details before starting the game. A static map of the chosen destination is also displayed. The admin can start the game only when minimum 3 players (maximum 6 players) have joined the lobby and all game settings have been updated.  

### Voting ([GameSubmission.tsx](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/main/src/components/views/GameSubmission.tsx))
After each round,game submission component handles the submission and voting phase of the game. The submitted location's image is clickable, which will display the street view of this location. Players can vote on and ban other players' submissions. If players cannot find a location, they have the option to click on "Can't find it" to make an empty submission. An empty submission will be showed grayed out to indicate that a player has made an empty submission. Similarly, if the time runs out before a player makes a submission, this will also be grayed out as an empty submission. The voting component is essential for determining the leaderboard ranking based on player votes.

### Game Summary ([GameSummary.tsx](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/main/src/components/views/GameSummary.tsx))
Game Summary component provides a detailed overview of the game all quests are completed. Links to each round's winning location and the interactive city map marked with all winning locations are displayed on the game summary page. Additionally, links for route directions- both in order of rounds and in shortest distance- are also provided. The game summary page is saved for later access, allowing players to re-visit their explored locations and itinerary for later use, as well as to discover other lobbies' winning locations.  

## Launch & Deployment
Clone the repository with the following command:   
`git clone (https://github.com/sopra-fs24-group-12/PeekSeek-client.git)`  

Run the below command to install dependencies related to React before you start your application for the first time:   
`npm install`  

This application utilizes Google Maps API, therefore requires setting up environment variables:  
Create a `.env` file in the root directory and add your Google Maps API key:  
`REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here`  

Start the application with:  
`npm run dev`  

This command will run the application locally on browser. If the browser does not open automatically, you can use the following link: 
[http://localhost:3000](http://localhost:3000).
This application is designed to work best on Google Chrome. 

You can run the tests with:  
`npm run test`  

The below command builds the app for production to the build folder:
`npm run build`

## Walkthroug and Illustrations
1. You will start by creating a lobby or joining an existing lobby. If joining a lobby, sit back and enjoy. If creating the lobby, you will have the honors of choosing the destination and quests.
    - Created lobbies are saved for other players to benefit as well. If you would like to make the lobby private, you can password protect it and share the password with your friends only.  
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/0214e928e8fa56753da09f184a430137936e39d7/public/images/lobby-illustration.png)  
2. All players will navigate on Google Maps to find the locations defined in the quest, like finding a nice beach view in Sydney.   
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/f61b96fca0efbbe998882cfe3043b097713b200a/public/images/game-illustration.png)  
3. Once all the players submit their selected location, it's time to vote! You will pick the location you would like to visit the most and ban the one(s) you think are not reflective of the quest.  
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/f61b96fca0efbbe998882cfe3043b097713b200a/public/images/voting-illustration.png)
    - Players can have a closer look to submissions by clicking on the images, which will display the street view of submitted location.  
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/eceb9a0c14f45738b4437488a3aa4a9d74579f1b/public/images/submission-illustration.png)  
5. Each player will collect points based other players' votes and on how quickly they spotted the location.  
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/d586c45bc522b4b2305ce3cd55a4d5d19c250e63/public/images/leaderboard-illustration.png)  
6. Completed all the quests? Congratulations, you have explored your destination! You will now have a final map marked with all winning locations and direct links for each. Additionally, you will see an itinerary created for you, so that you can follow the directions on Google Maps when you arrive at your destination!  
    - The game summary page will also be stored so that you can revisit your past game's winning submissions and route direction, or visit other player's game summaries!  
![ScreenShot](https://github.com/sopra-fs24-group-12/PeekSeek-client/blob/af6b869203364ae7fadc6db8d782c482e5706db7/public/images/gamesummary-illustration.png)   

## Roadmap
- Implement a chat to communicate during the game
- Add a fun play mode where it's not about discovering a city but just having fun finding funny things
- Add trivia/fun facts about the city in the waiting page between the rounds

## Authors and acknowledgment
- [Nils Reusch](https://github.com/Arche1ion)
- [Ece Asirim](https://github.com/asirimece)  
- [Youssef Farag](https://github.com/Figo2003)  
- [Georg Emmermann](https://github.com/emmge)  
- [Silvan Schlegel](https://github.com/silvanschlegel)

We thank Marion Andermatt for her guidance as well as all teaching assistants of the module Software Engineering Praktikum at the University of Zurich for their feedback and considerations on our project.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/sopra-fs24-group-12/PeekSeek-server/blob/main/LICENSE) file for details.

