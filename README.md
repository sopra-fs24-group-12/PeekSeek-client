# Welcome to PeekSeek!
### SoPra FS24

## Project Goal & Motivation
PeekSeek transforms travel planning into a fun, gamified exploration! This interactive game allows players to virtually explore various destinations on Google Maps while competing with friends. Players choose a city they might want to visit and complete multiple quests by finding specific locations in that city, such as landmarks or brunch spots. At the end of the game, all locations are marked on the city map, giving a sense of an itinerary. This makes travel planning more enjoyable and less stressful, ensuring your trip actually happens!

(TBD- OR A MORE ENGAGING INTRO:)
Can you think of a time when you and your friends were planning to travel together but couldn't agree on a destination? Was everyone excited and motivated, yet planning the itinerary seemed like too much hustle? PeekSeek transforms this challenge into a fun, gamified exploration! 

PeekSeek is an interactive game where player virtually explore various destinations on Google Maps in an engaging way while competing with friends. Players choose a city they might want to visit and complete multiple quests by finding specific locations in that city, like landmarks or a brunch spot. At the end of the game, all locations are marked on the city map, giving a sense of an itinerary. This makes travel planning more enjoyable and less stressful, ensuring your trip does actually happen!

## Technologies
- React
- Tailwind CSS
- Next UI
- Google JavaScript API
- Google Geocoding API
- Google Static Image API

## High-level components
Below are the main frontend components:

### Lobby Component (Lobby.tsx):
- Role: Manages the initial game setup where players join the game.
- Correlation: Connects to the game server to initialize game sessions.

### GameSubmission Component (GameSubmission.tsx):
- Role: Handles player submissions of locations they find on the map.
- Correlation: Interacts with the backend to verify and store submissions.

### VotingResults Component (VotingResults.tsx):
- Role: Manages the voting process to decide on the winning submissions to display on leaderboard and to determine the final map based on players' inputs.
- Correlation: Aggregates and displays voting results, contributing to the final decision-making.
  
### GameSummary Component (GameSummary.tsx):
- Role: Displays the summary of the game, including direct links for each winning submission and route directions (both in round order or by shortest distance), and the final map marked with all winning submissions.
- Correlation: Compiles and presents data from the game sessions.


_Identify your project’s 3-5 main components. What is their role?_
_How are they correlated? Reference the main class, file, or function in the README text
with a link._

## Launch & Deployment
_Write down the steps a new developer joining your team would have to take to get started with your application. What commands are required to build and run your project locally? How can they run the tests? Do you have external dependencies or a database that needs to be running? How can they do releases?_

## Illustrations
_In your client repository, briefly describe and illustrate the main user flow(s) of your interface. How does it work (without going into too much detail)? Feel free to include a few screenshots of your application._
1. You will start by creating a lobby or joining an existing lobby. If joining a lobby, sit back and enjoy. If creating the lobby, you will have the honors of choosing the destination and quests.
    - Created lobbies are saved for other players to benefit as well. If you would like to make the lobby private, you can password protect it to     share the password with your friends only.
2. All players will navigate on Google Maps to find the locations defined in the quest. 
    - Example: Find a landmark in Paris.
3. Once all the players submit their selected location, it's time to vote! You will pick the location you would like to visit the most and ban the one(s) you think are not reflective of the quest.
4. Each player will collect points based other players' votes and on how quickly they spotted the location.
5. Completed all the quests? Congratulations, you have explored your destination! You will now have a final map marked with all winning locations and direct links for each. Additionally, you will see an itinerary created for you, so that you can follow the directions on Google Maps when you arrive at your destination!
    - The game summary page will also be stored so that you can revisit your past game's winning submissions and route direction, or visit other player's game summaries!

## Roadmap
_The top 2-3 features that new developers who want to contribute to your project could add._

## Authors and acknowledgment
Nils Reusch  
Ece Asirim  
Youssef Farag  
Georg Emmermann  
Silvan Schlegel  

We thank Marion Andermatt for her guidance as well as all teaching assistants of the module Software Engineering Praktikum at the University of Zurich for their feedback and considerations on our project.

## License
_Say how your project is licensed (see License guide3)._

