import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";


// @ts-ignore
import placeholder from '../../assets/modelSubmission.png';
interface SubmissionCardProps {
  cityName: string;
  quest: string;
  anonymousName: string;
  imageUrl?: string;
}

const WinningCard: React.FC<SubmissionCardProps> =
  ({
     cityName,
     quest,
     anonymousName,
     imageUrl,
   }) => {
    return (
      <Card className="py-4 mx-auto max-w-sm">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large text-center">WINNING SUBMISSION</h4>
          <small className="text-default-500">{quest}</small>
          <h5 className="font-bold text-large">Found by {anonymousName}</h5>
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

export default WinningCard;


