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
    waiting: "w-[100%] h-[100%] overflow-auto shadow-lg",
    landing: "w-auto h-auto overflow-auto shadow-lg",
    large: "w-auto h-[100%] overflow-auto shadow-lg",
    medium: "w-auto h-auto overflow-auto shadow-lg",
    small: "w-auto h-auto overflow-auto shadow-lg",
  };

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