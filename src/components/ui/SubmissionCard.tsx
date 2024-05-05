import React, { useState } from "react";
import { Card, CardHeader, CardBody, Image, CardFooter, Button } from "@nextui-org/react";

// @ts-ignore
import placeholder from "../../assets/modelSubmission.png";
import BackIcon from "./BackIcon";
import PickIcon from "./PickIcon";
import BanIcon from "./BanIcon";

interface SubmissionCardProps {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  onImageClick: () => void;  // Handler for clicking the card
  onPickClick: () => void;
  onBanClick: () => void;
  onUnpickClick: () => void;
  onUnbanClick: () => void;
  isPicked: boolean;
  isBanned: boolean;
  noSubmission: boolean;
}

const greenBorderStyle = {
  borderRadius: "8px",
  boxShadow: "0 0 18px 5px rgba(72, 187, 120, 0.7)",
};

const redBorderStyle = {
  borderRadius: "8px", // Rounded corners
  boxShadow: "0 0 18px 5px rgba(204, 0, 0, 0.7)",
};

const noBorderStyle = {
  borderRadius: "8px",
  boxShadow: "none",
};


const SubmissionCard: React.FC<SubmissionCardProps> =
  (
    {
      cityName,
      quest,
      anonymousName,
      imageUrl,
      onImageClick,
      onPickClick,
      onBanClick,
      onUnpickClick,
      onUnbanClick,
      isPicked,
      isBanned,
      noSubmission,
    }
  ) => {

    const determineBorderStyle = () => {
      if (isBanned) {
        return redBorderStyle;
      } else if (isPicked) {
        return greenBorderStyle;
      } else {
        return noBorderStyle;
      }
    };

    return (
      <Card style={determineBorderStyle()} className={`py-4 mx-auto max-w-xs ${noSubmission ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{cityName}</p>
          <small className="text-default-500">{quest}</small>
          <h4 className="font-bold text-large">{anonymousName}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card image"
            className="object-cover rounded-xl"
            src={imageUrl || placeholder}
            width={270}
            isZoomed
            isBlurred
            onClick={onImageClick}
          />
        </CardBody>
        <CardFooter className="flex justify-center space-x-4">
          <Button
            isIconOnly
            onClick={!isPicked ? onPickClick : onUnpickClick}
            radius="full"
            size="md"
            className="items-center bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-sm">
            {/*{!isPicked ? "Pick" : "Unpick"}*/}
            <PickIcon/>
          </Button>
          <Button
            isIconOnly
            onClick={!isBanned ? onBanClick : onUnbanClick}
            radius="full"
            size="md"
            className="items-center bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-sm">
            {/*{!isBanned ? "Ban" : "Unban"}*/}
            <BanIcon/>
          </Button>
        </CardFooter>
      </Card>
    );
  };

export default SubmissionCard;