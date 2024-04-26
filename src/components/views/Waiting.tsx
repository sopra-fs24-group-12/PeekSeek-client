import React, { useEffect, useState } from "react";
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
const funFacts = [
  "Did you know? The Great Wall of China is over 13,000 miles long!",
  "Fun fact: The Eiffel Tower was supposed to be a temporary installation.",
  "Travel trivia: The Colosseum in Rome could hold 50,000 to 80,000 spectators.",
  "Interesting fact: The Statue of Liberty was a gift from France to the United States.",
  "Fun travel fact: Venice, Italy, is built on more than 100 small islands.",
  "Did you know? Dubai's Burj Khalifa is the tallest building in the world, standing at 828 meters (2,717 feet)."
];

const Waiting = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [randomFact, setRandomFact] = useState("");

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
            navigate("/submissions/" + gameId);
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

  useEffect(() => {
  
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setRandomFact(funFacts[randomIndex]);
  }, []);

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
            Here's a fun fact!
            {randomFact}
          </h1>
        </div>
      </div>
    </ BaseContainer>
  );
};


export default Waiting;
