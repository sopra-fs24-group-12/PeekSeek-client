import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import GameSubmission from "../../views/GameSubmission";
<<<<<<< HEAD
import LandingPage from "../../views/LandingPage";
import CreateLobby from "../../views/CreateLobby";
=======
import VotingResults from "../../views/VotingResults";
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7

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

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

<<<<<<< HEAD
        <Route path="/landing" element={<LoginGuard />}>
          <Route path="/landing" element={<LandingPage />} />
        </Route>

        <Route path="/create" element={<LoginGuard />}>
          <Route path="/create" element={<CreateLobby />} />
        </Route>

=======
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
        <Route path="/gamesub" element={<LoginGuard />}>
          <Route path="/gamesub" element={<GameSubmission />} />
        </Route>

<<<<<<< HEAD
=======
        <Route path="/votingres" element={<LoginGuard />}>
          <Route path="/votingres" element={<VotingResults />} />
        </Route>

>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
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
