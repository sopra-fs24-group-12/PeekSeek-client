import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

// @ts-ignore
import placeholder from "../../assets/modelSubmission.png";
interface SubmissionCardProps {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
}

const SubmissionCard: React.FC<SubmissionCardProps> =
  ({
    cityName,
    quest,
    anonymousName,
    imageUrl,
  }) => {
    return (
      <Card className="py-4 mx-auto max-w-sm">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{cityName}</p>
          <small className="text-default-500">{quest}</small>
          <h4 className="font-bold text-large">{anonymousName}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card image"
            className="object-cover rounded-xl"
            src={placeholder}
            width={270} // You might adjust this depending on your layout needs
          />
        </CardBody>
      </Card>
    );
  };

export default SubmissionCard;
