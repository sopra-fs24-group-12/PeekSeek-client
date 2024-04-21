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
        console.log("sent active message")
      } catch (error) {
        alert(
          `Something went wrong while sending active ping: \n${handleError(error)}`,
        );
      }
    };

    sendRequest();

    const intervalId = setInterval(() => {
      sendRequest();
    }, 2000);

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
    <BaseContainer className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner />
      </div>
      <p className="mt-4 text-center text-grey" style={textStyle}>Waiting for all participants to finish...</p>
    </BaseContainer>
  );
};

// Inline styles for text
const textStyle = {
  fontWeight: "bold", // Very bold
  fontSize: "2rem" // Larger font size
};

export default Waiting;
