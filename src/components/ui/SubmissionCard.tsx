import React from "react";
import { Card, CardHeader, CardBody, Image, CardFooter, Button } from "@nextui-org/react";

// @ts-ignore
import placeholder from "../../assets/modelSubmission.png";
interface SubmissionCardProps {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
  onImageClick: () => void;  // Handler for clicking the card
  onPickClick: () => void;
  onBanClick: () => void;
}

const SubmissionCard: React.FC<SubmissionCardProps> =
  ({
     cityName,
     quest,
     anonymousName,
     imageUrl,
     onImageClick,
     onPickClick,
     onBanClick
   }) => {
    return (
      <Card
        className="py-4 mx-auto max-w-xs"
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
            onClick={onPickClick}
            radius="full"
            size="sm"
            className="items-center bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-sm"
          >Pick</Button>
          <Button
            onClick={onBanClick}
            radius="full"
            size="sm"
            className="items-center bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-sm"
          >Ban</Button>
        </CardFooter>
      </Card>
    );
  };

export default SubmissionCard;
