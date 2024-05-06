import React, { useState, useEffect } from "react";
import {Card, CardBody} from "@nextui-org/react";

type ContainerSize = "waiting" | "landing" | "small" | "medium" | "large";

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: ContainerSize;
  initialSize?: ContainerSize;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ className, children, size, initialSize = "large" }) => {
  const [containerSize, setContainerSize] = useState<ContainerSize>(size || initialSize);

  const containerClasses = {
    waiting: "w-[100%] h-[100%] overflow-auto shadow-lg",
    landing: "w-[25%] h-[73%] overflow-auto shadow-lg",
    large: "w-[95%] h-[95%] overflow-auto shadow-lg",
    medium: "w-3/4 h-3/4 overflow-auto shadow-lg",
    small: "w-[35%] h-[85%] overflow-auto shadow-lg",
  };

  // Function to determine container size based on window width
  const determineContainerSize = () => {
    if (size) return; // Do not adjust size if it's explicitly set

    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
      setContainerSize("small");
    } else if (windowWidth < 1024) {
      setContainerSize("medium");
    } else {
      setContainerSize("large");
    }
  };

  useEffect(() => {
    setContainerSize(size || initialSize); // Set size on mount
    window.addEventListener("resize", determineContainerSize);
    
    return () => {
      window.removeEventListener("resize", determineContainerSize); // Clean up on unmount
    };
  }, []);
  
  const containerClass = containerClasses[containerSize];

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

