import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

//import UI elements
<<<<<<< HEAD
import BaseContainer from "../ui/BaseContainer";
=======
import BaseContainerLarge from "../ui/BaseContainerLarge";
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
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
<<<<<<< HEAD
    <BaseContainer size="large">
      <div className="flex flex-col items-center justify-center md:flex-row w-full h-full">
        {/* Container for the submission cards */}
        <div className="md:w-3/4 w-full p-4 flex flex-col">
          <div className="order-first grid lg:grid-cols-3 grid-cols-1 gap-4">
=======
    <BaseContainerLarge>
      <div className='order-first text-center p-4'>
        <h1 className='text-3xl font-bold text-gray-700'>Choose your Favourite Pick</h1>
      </div>
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Container for the submission cards */}
        <div className="md:w-3/4 w-full p-4 flex flex-col">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
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

<<<<<<< HEAD
          <div className="w-full flex justify-center pt-12 pb-4">
=======
          <div className="w-full flex justify-center p-4">
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
            <SubmitButton />
          </div>
        </div>

        {/* Chat Component */}
        <div className="md:w-1/4 w-full p-4 lg:order-none">
          <Chat />
        </div>
      </div>
<<<<<<< HEAD
    </BaseContainer>
=======
    </BaseContainerLarge>
>>>>>>> ebdeb8fda43ed305682c4617c11a3ec0c2ffe1b7
  );
}

export default GameSubmission;
