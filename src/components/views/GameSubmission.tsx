import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

//import UI elements
import BaseContainer from "../ui/BaseContainer";
import SubmissionCard from "../ui/SubmissionCard";
import Chat from "../ui/Chat";
import SubmitButton from "../ui/SubmitButton";


interface CardData {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  link: string;
}

const GameSubmission = () => {

  const handleImageClick = (url: string) => {
    window.open(url, "_blank");
  };

  const handlePickClick = (index) => {
    console.log(`Card ${index} picked`);
    // Add additional logic as required
  };

  const handleBanClick = (index) => {
    console.log(`Card ${index} banned`);
    // Add banning logic
  };
  // Placeholder data - you might replace this with actual data from your backend
  const cardsData = [
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Koala", imageUrl:"", link: "https://example.com/link1" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Bear", imageUrl:"", link: "https://example.com/link1" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Giraffe", imageUrl:"", link: "https://example.com/link1" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Zebra", imageUrl:"", link: "https://example.com/link1" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Gazelle", imageUrl:"", link: "https://example.com/link1" },
    { cityName: "Rome", quest: "Locate the best sunrise spot", anonymousName: "Anonymous Elephant", imageUrl:"", link: "https://example.com/link1" },
  ];

  return (
    <BaseContainer
      size="large"
      className="flex flex-col items-center"
    >
      <div className='order-first text-center p-4'>
        <h1 className='text-3xl font-bold text-gray-700'>Choose your Favourite Pick</h1>
      </div>
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Container for the submission cards */}
        <div className="md:w-3/4 w-full p-4 flex flex-col">
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            {cardsData.map((card, index) => (
              <SubmissionCard
                key={index}
                cityName={card.cityName}
                quest={card.quest}
                anonymousName={card.anonymousName}
                imageUrl={card.imageUrl}
                onImageClick={() => handleImageClick(card.link)}
                onPickClick={() => handlePickClick(index)}
                onBanClick={() => handleBanClick(index)}
              />
            ))}
          </div>

          {/*<div className="w-full flex justify-center p-4">*/}
          {/*  <SubmitButton />*/}
          {/*</div>*/}
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
