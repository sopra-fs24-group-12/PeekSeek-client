import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Textarea } from "@nextui-org/react";
import BackButton from "../ui/BackButton";
import PolicyContainer from "../ui/PolicyContainer";


const About = () => {
  const navigate = useNavigate();


  const goBack = () => {
    navigate("/landing");
  };

  return (

    <div className="w-full h-full flex flex-col">
      <div className="absolute top-4 left-4 z-50">
        <BackButton />
      </div>

      <div className="flex items-center h-full flex-col mt-10 mr-40 ml-40 mb-10">
        <h1
          className="text-4xl text-center mb-10"
          style={{
            fontFamily: "'Permanent Marker', cursive",
            fontSize: "4rem",
            maxWidth: "90vw",
            whiteSpace: "normal",
            overflow: "visible",
          }}
        >
          PeekSeek
        </h1>
        <PolicyContainer size="policy" className="flex-grow overflow-y-auto flex flex-col items-center max-w-full mt-2 mb-2">
          <p className="text-medium text-gray-700 my-0 mb-2">
            PeekSeek was created with much ❤️ in the Software Engineering Lab in Spring 2024.
          </p>
          <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">
            Our Mission
          </h2>
          <p className="text-medium text-gray-700 my-0 mb-2">
            At PeekSeek, our mission is to revolutionize group travel planning by transforming it into an engaging and collaborative adventure. We aim to simplify the process of creating memorable travel experiences by blending the thrill of exploration with practical itinerary planning. PeekSeek is committed to enhancing group travel experiences by making planning both enjoyable and efficient, providing a platform that encourages discovery and collaboration among friends.
          </p>

          <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">
            Advice/Information
          </h2>
          <p className="text-medium text-gray-700 my-0 mb-2">
            PeekSeek is optimized for Google Chrome and a screen size of 1378x766.
          </p>
          <h2 className="text-medium font-bold text-gray-700 my-0 mb-2">The Team</h2>
          <ul className="text-medium text-gray-700 my-0 mb-2">
            <li className="text-medium text-gray-700 my-0 mb-2">Nils Reusch</li>
            <li className="text-medium text-gray-700 my-0 mb-2">Ece Asirim</li>
            <li className="text-medium text-gray-700 my-0 mb-2">Youssef Farag</li>
            <li className="text-medium text-gray-700 my-0 mb-2">Georg Emmermann</li>
            <li className="text-medium text-gray-700 my-0 mb-2">Silvan Schlegel</li>
          </ul>

        </PolicyContainer>
      </div>


      {/*<div className="flex items-center h-full flex-col  mb-10 mt-auto">*/}
      {/*  <Button*/}
      {/*    color="primary"*/}
      {/*    onClick={goBack}*/}
      {/*    radius = "full"*/}
      {/*  >*/}
      {/*    Back*/}
      {/*  </Button>*/}

      {/*</div>*/}
    </div>


  );
};

export default About;