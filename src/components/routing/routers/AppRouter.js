import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import GameSubmission from "../../views/GameSubmission";
import Landing from "../../views/Landing";
import CreateLobby from "../../views/CreateLobby";
import Join from "../../views/Join";
import Game from "../../views/Game";
import VotingResults from "../../views/VotingResults";
import GameSummary from "../../views/GameSummary";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

          <Route path="/game/*" element={<GameRouter base="/game"/>} />

          <Route path="/landing" element={<Landing />} />

          <Route path="/join" element={<Join />} />

          <Route path="/create" element={<CreateLobby />} />

          <Route path="/gamesub/:gameId" element={<GameSubmission />} />

          <Route path="/gamesummary/:summaryId" element={<GameSummary />} />

        <Route path="/game/:gameId" element={<Game />} />

          <Route path="/voting/:gameId" element={<VotingResults />} />

        <Route path="/" element={
          <Navigate to="/game" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
