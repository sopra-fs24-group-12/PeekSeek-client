import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Landing from "../../views/Landing";
import CreateLobby from "../../views/CreateLobby";
import Join from "../../views/Join";
import Lobby from "../../views/Lobby";
import Game from "../../views/Game";
import GameSubmission from "../../views/GameSubmission";
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

        <Route path="/landing" element={<Landing />} />

        <Route path="/join" element={<Join />} />

        <Route path="/create" element={<LoginGuard />}>
          <Route path="/create" element={<CreateLobby />} />
        </Route>

        <Route path="/lobby/:lobbyId" element={<Lobby />} />

        <Route path="/gamesummary" element={<LoginGuard />}>
          <Route path="/gamesummary" element={<GameSummary />} />
        </Route>

        <Route path="/game" element={<LoginGuard />}>
          <Route path="/game" element={<Game />} />
        </Route>

        <Route path="/gamesub" element={<LoginGuard />}>
          <Route path="/gamesub" element={<GameSubmission />} />
        </Route>

        <Route path="/voting" element={<LoginGuard />}>
          <Route path="/voting" element={<VotingResults />} />
        </Route>

        <Route path="/" element={
          <Navigate to="/landing" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
