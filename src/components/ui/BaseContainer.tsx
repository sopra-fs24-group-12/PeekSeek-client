import React from "react";
import {Card, CardBody} from "@nextui-org/react";

type ContainerSize = "waiting" | "landing" | "small" | "medium" | "large";

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: ContainerSize;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ className, children, size = "large" }) => {
  const containerClasses = {
    waiting: "w-full h-full",
    landing: "w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3",
    large: "w-11/12 md:w-3/4 lg:w-2/3",
    medium: "w-11/12 sm:w-3/4 lg:w-1/2",
    small: "w-11/12 sm:w-2/3 md:w-1/2",
  };

  // Adding 'min-h-screen' to ensure that the container takes at least the full height of the screen but grows with content
  const containerClass = containerClasses[size];

  return (
    <div className={`fixed inset-0 flex justify-center items-center ${className || ""}`}>
      <Card
        className={`${containerClass} flex flex-col`}
        isBlurred
      >
        <CardBody className="overflow-visible py-2">
          {children}
        </CardBody>
      </Card>
    </div>
  );
};

export default BaseContainer;
