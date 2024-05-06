import React from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Join Button clicked!");
    navigate("/join/");
  };

  return (
    <BaseContainer size="landing" className="flex flex-col items-center">
      <h4
        className="text-center mt-8"
        style={{ fontFamily: "'Lato', regular-400" }}
      >
        Welcome to
      </h4>
      <h1
        className="text-7xl text-center"
        style={{
          fontFamily: "'Permanent Marker', cursive",
          fontSize: "4rem", // Adjust this value for a larger base size
          maxWidth: "90vw", // Limits the width of the text to the viewport
          whiteSpace: "nowrap", // Prevents the text from wrapping
          overflow: "hidden",
          textOverflow: "ellipsis", // Prevent overflow issues
        }}
      >
        PeekSeek
      </h1>
      <div className="flex-grow flex items-center justify-center">
        <img
          src="/images/PeekSeeklogo.jpg"
          alt="PeekSeek Logo"
          style={{
            width: "350px", // Adjust the width to fit the container
            maxWidth: "100%", // Prevents overflow from the container
            height: "auto", // Adjusts height based on the width
            objectFit: "contain" // Ensures image retains its aspect ratio
          }} />
      </div>
      <div className="w-full flex justify-center mb-4">
        <JoinButton onClick={handleClick}/>
      </div>
      <div className="w-full flex justify-center mb-4">
        <CreateButton />
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
