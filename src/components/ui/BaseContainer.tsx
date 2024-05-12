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
    waiting: "w-full max-h-full overflow-auto shadow-lg",
    landing: "w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 max-h-full md:max-h-screen lg:max-h-screen xl:max-h-screen overflow-auto shadow-lg",
    large: "w-full md:w-full lg:w-full xl:w-full h-full md:h-screen lg:h-screen xl:h-screen overflow-auto shadow-lg",
    medium: "w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-2/3 max-h-full sm:max-h-screen md:max-h-screen lg:max-h-screen xl:max-h-screen overflow-auto shadow-lg",
    small: "w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/2 max-h-full sm:max-h-screen md:max-h-screen lg:max-h-screen xl:max-h-screen overflow-auto shadow-lg",
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

