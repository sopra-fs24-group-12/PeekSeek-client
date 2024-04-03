import React from "react";
import {Card, CardBody} from "@nextui-org/react";

interface BaseContainerLargeProps {
  className?: string;
  children: React.ReactNode;
}

const BaseContainerLarge: React.FC<BaseContainerLargeProps> = ({ className, children }) => {
  return (
    <div className={`fixed inset-0 flex justify-center items-center p-10 ${className || ''}`}>
      <Card
        className="w-full h-auto"
        isBlurred

      >
        <CardBody
          className="flex flex-col justify-center items-center p-4"
          style={{ maxHeight: 'calc(150vh)' }} // Adjust this value to ensure content fits without scrolling
        >
          {children}
        </CardBody>
      </Card>
    </div>
  );
};
export default BaseContainerLarge;