import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import GameSubmission from "../../views/GameSubmission";
import Landing from "../../views/Landing";
import CreateLobby from "../../views/CreateLobby";
import JoinLobby from "../../views/JoinLobby";
import JoinUser from "../../views/JoinUser";
import Lobby from "../../views/Lobby";
import Game from "../../views/Game";
import VotingResults from "../../views/VotingResults";
import GameSummary from "../../views/GameSummary";
import Waiting from "../../views/Waiting";
import RedirectWithMessage from "../../ui/RedirectWithMessage";
import PrivacyPolicy from "../../views/PrivacyPolicy";
import About from "../../views/About";
import TestGameSubmission from "../../views/TestGameSubmission";
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

        <Route path="/gamesub" element={<TestGameSubmission />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />

        <Route path="/about" element={<About />} />

        <Route path="/landing" element={<Landing />} />

        <Route path="/join" element={<JoinLobby />} />

        <Route path="/join/:id" element={<JoinUser />} />

        <Route path="/create" element={<CreateLobby />} />

        <Route path="/lobby/:lobbyId" element={<GameGuard />} >
          <Route path="/lobby/:lobbyId" element={<Lobby />} />
        </Route>

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game" />} />
        </Route>

        <Route path="/game/:gameId" element={<GameGuard />}>
          <Route path="/game/:gameId" element={<Game />} />
        </Route>

        <Route path="/submissions/:gameId" element={<GameGuard />} >
          <Route path="/submissions/:gameId" element={<GameSubmission />} />
        </Route>

        <Route path="/voting/:gameId" element={<GameGuard />} >
          <Route path="/voting/:gameId" element={<VotingResults />} />
        </Route>

        <Route path="/waiting/:gameId" element={<GameGuard />} >
          <Route path="/waiting/:gameId" element={<Waiting />} />
        </Route>

        <Route path="/gamesummary/:summaryId" element={<GameSummary />} />

        <Route path="*" element={<RedirectWithMessage message="This page doesn't exist. You are redirected back to PeekSeek" redirectTo="/landing" />} />

        <Route path="/" element={
          <Navigate to="/landing" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
