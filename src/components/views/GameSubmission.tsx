import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import Chat from "../ui/Chat";
import SubmitButton from "../ui/SubmitButton";

const GameSubmission = () => {
  // Placeholder data - you might replace this with actual data from your backend
  const cardsData = [
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Koala", imageUrl: "/path/to/image1.jpg" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Bear", imageUrl: "/path/to/image1.jpg" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Giraffe", imageUrl: "/path/to/image1.jpg" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Zebra", imageUrl: "/path/to/image1.jpg" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Gazelle", imageUrl: "/path/to/image1.jpg" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Elephant", imageUrl: "/path/to/image1.jpg" },
  ];

  return (
    <BaseContainer size="large">
      <div className="flex flex-col items-center justify-center md:flex-row w-full h-full">
        {/* Container for the submission cards */}
        <div className="md:w-3/4 w-full p-4 flex flex-col">
          <div className="order-first grid lg:grid-cols-3 grid-cols-1 gap-4">
            {cardsData.map((card, index) => (
              <SubmissionCard
                key={index}
                cityName={card.cityName}
                quest={card.quest}
                anonymousName={card.anonymousName}
                imageUrl={card.imageUrl}
              />
            ))}
          </div>

          <div className="w-full flex justify-center pt-12 pb-4">
            <SubmitButton />
          </div>
        </div>

        {/* Chat Component */}
        <div className="md:w-1/4 w-full p-4 lg:order-none">
          <Chat />
        </div>
      </div>
    </BaseContainer>
  );
}

export default GameSubmission;
