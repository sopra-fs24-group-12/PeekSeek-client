import React, { useState } from "react";
import BaseContainer from "../ui/BaseContainer";
import JoinButton from "components/ui/JoinButton";
import CreateButton from "components/ui/CreateButton";
import { useNavigate } from "react-router-dom";
import HowToPlayModal from "components/ui/HowToPlayModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Button, Link, useDisclosure } from "@nextui-org/react";
import MediaDisplay from "components/ui/MediaDisplay";


const LandingPage = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleClick = () => {
    console.log("Join Button clicked!");
    navigate("/join/");
  };


  return (
    <>
      <div className="w-screen h-screen flex flex-col relative">
        <BaseContainer size="landing" className="flex flex-col items-center justify-center">
          <div className="text-center mt-8">
            <h4
              style={{
                fontFamily: "'Lato', regular-400",
                fontSize: "1.3rem",
                fontWeight: "bold",
              }}
            >
              Welcome to
            </h4>
            <h1
              className="text-7xl text-center"
              style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "4rem",
                maxWidth: "90vw",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              PeekSeek
            </h1>
          </div>
          <div className="flex-grow flex items-center justify-center mt-4 mb-32">
            <MediaDisplay />
            {/* <img
          src="/images/PeekSeeklogo.jpg"
          alt="PeekSeek Logo"
          style={{
            width: "350px", // Adjust the width to fit the container
            maxWidth: "100%", // Prevents overflow from the container
            height: "auto", // Adjusts height based on the width
            objectFit: "contain" // Ensures image retains its aspect ratio
          }} /> */}
          </div>
          <div className="absolute bottom-2 w-full flex flex-col items-center mt-auto gap-2">
            <JoinButton onClick={handleClick}/>
            <CreateButton />
          </div>
          <Button
            onPress={onOpen}
            className="absolute bottom-2 right-2 p-2 sm rounded-full bg-transparent"
            isIconOnly
          >
            <InfoCircleTwoTone style={{ fontSize: "20px"}}/>
          </Button>
          <HowToPlayModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            context="landing"  />

        </BaseContainer>
        <div className="absolute bottom-2 right-4 flex">
          <Link
            href="/about"
            underline="hover"
            style={{
              fontFamily: "'Lato'",
              fontWeight: 400,
              fontSize: "15px",
              marginRight:"20px",
              color: "#4a5568"
            }}>About
          </Link>

          <Link
            href="/privacy"
            underline="hover"
            style={{
              fontFamily: "'Lato'",
              fontWeight: 400,
              fontSize: "15px",
              color: "#4a5568"
            }}>Privacy Policy
          </Link>

        </div>
      </div>
    </>
  );
};

export default LandingPage;