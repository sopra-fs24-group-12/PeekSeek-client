import React from "react";
import { Card, CardHeader, CardBody, Image, CardFooter, Button, Skeleton } from "@nextui-org/react";
// @ts-ignore
import placeholder from "../../assets/modelSubmission.png";

interface SubmissionCardProps {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  onImageClick: () => void;
  onPickClick: () => void;
  onBanClick: () => void;
  onUnpickClick: () => void;
  onUnbanClick: () => void;
  isPicked: boolean;
  isBanned: boolean;
  noSubmission: boolean;
  imageLoaded: () => void;
  showImage: boolean;
}

const greenBorderStyle = {
  borderRadius: "8px",
  boxShadow: "0 0 18px 5px rgba(72, 187, 120, 0.7)",
};

const redBorderStyle = {
  borderRadius: "8px",
  boxShadow: "0 0 18px 5px rgba(204, 0, 0, 0.7)",
};

const noBorderStyle = {
  borderRadius: "8px",
  boxShadow: "none",
};

const SubmissionCard: React.FC<SubmissionCardProps> = ({ cityName, quest, anonymousName, imageUrl, onImageClick, onPickClick, onBanClick, onUnpickClick, onUnbanClick, isPicked, isBanned, noSubmission, imageLoaded, showImage, }) => {
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
    <Card
      style={determineBorderStyle()}
      className={`py-4 mx-auto max-w-xs ${noSubmission ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <div className="mb-0.5">
          <Skeleton isLoaded={showImage} className="rounded-lg">
            <div className="text-tiny uppercase font-bold">{cityName}</div>
          </Skeleton>
        </div>
        <div className="mb-0.5">
          <Skeleton isLoaded={showImage} className="rounded-lg">
            <div className="text-default-500">{quest}</div>
          </Skeleton>
        </div>
        <div>
          <Skeleton isLoaded={showImage} className="rounded-lg">
            <div className="font-bold text-large">{anonymousName}</div>
          </Skeleton>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Skeleton isLoaded={showImage} className="rounded-lg">
          <Image
            alt="Card image"
            className="object-cover rounded-xl"
            src={imageUrl || placeholder}
            width={270}
            isZoomed
            isBlurred
            onClick={onImageClick}
            onLoad={imageLoaded}
          />
        </Skeleton>
      </CardBody>
      <CardFooter className="flex justify-center space-x-4">
        <Button
          onClick={!isPicked ? onPickClick : onUnpickClick}
          radius="full"
          size="sm"
          className="items-center bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-sm"
        >
          {!isPicked ? "Pick" : "Unpick"}
        </Button>
        <Button
          onClick={!isBanned ? onBanClick : onUnbanClick}
          radius="full"
          size="sm"
          className="items-center bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-sm"
        >
          {!isBanned ? "Ban" : "Unban"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubmissionCard;
