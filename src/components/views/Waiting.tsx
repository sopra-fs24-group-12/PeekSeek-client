import React, { useEffect } from "react";
import { getWebsocketDomain } from "helpers/getDomain";
import { useNavigate, useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import BaseContainer from "../ui/BaseContainer";
import { FaSpinner } from "react-icons/fa";
import { api, handleError } from "helpers/api";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <FaSpinner style={spinnerStyle} />
    </div>
  );
};

const spinnerStyle = {
  fontSize: "10rem",
  color: "grey",
  animation: "spin 3s linear infinite"
};

const Waiting = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sendRequest = async () => {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        await api.put(`/games/${gameId}/active`, null, { headers });
      } catch (error) {
        alert(
          `You were kicked due to inactivity. \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }
    };

    sendRequest();

    const intervalId = setInterval(() => {
      sendRequest();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let client = new Client();
    const websocketUrl = getWebsocketDomain();
    client.configure({
      brokerURL: websocketUrl,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = "/topic/games/" + gameId;
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log("Received message:", messageParsed);

          if (messageParsed.status === "voting") {
            navigate("/gamesub/" + gameId);
          } else if (messageParsed.status === "summary") {
            navigate("/voting/" + gameId);
          } else if (messageParsed.status === "game_over") {
            localStorage.clear();
            navigate("/gamesummary/" + messageParsed.summaryId);
          } else if (messageParsed.status === "started") {
            // Handle started message
          }
        });
      },
    });
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, [gameId]);

  return (
    <BaseContainer size="waiting" className="flex flex-col items-center">
      <div className="relative flex-grow flex items-center justify-center mb-12">
        <img
          src="/images/waitingbackground.jpg"
          alt="PeekSeek Logo"
          width="100%"
        />
        <div className="absolute top-5 left-20 z-10 flex items-center">
          <LoadingSpinner />
          <h1 className="text-4xl font-bold text-center ml-4">
            Waiting until everyone is done peeking ...
          </h1>
        </div>
      </div>
    </ BaseContainer>
  );
};


export default Waiting;
