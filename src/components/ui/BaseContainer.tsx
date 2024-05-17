import React, { useState, useEffect } from "react";
import {Card, CardBody} from "@nextui-org/react";

type ContainerSize = "waiting" | "landing" | "small" | "medium" | "large" | "game" | "policy";

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: ContainerSize;
  initialSize?: ContainerSize;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ className, children, size, initialSize = "large" }) => {
  const [containerSize, setContainerSize] = useState<ContainerSize>(size || initialSize);

  const containerClasses = {
    waiting: "w-full max-h-full shadow-lg",
    landing: "w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 max-h-full md:max-h-screen lg:max-h-screen xl:max-h-screen shadow-lg overflow",
    large: "w-full md:w-[95%] lg:w-[95%] xl:w-[95%] h-full md:h-[95vh] lg:h-[95vh] xl:h-[95vh] shadow-lg",
    game: "w-full md:w-[95%] lg:w-[95%] xl:w-[95%] h-full md:h-[75vh] lg:h-[75vh] xl:h-[75vh] shadow-lg",
    medium: "w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-2/3 max-h-full sm:max-h-screen md:max-h-screen lg:max-h-screen xl:max-h-screen shadow-lg",
    small: "w-full sm:w-3/4 md:w-3/5 lg:w-5/12 xl:w-5/12 h-full sm:h-4/5 md:h-4/5 lg:h-4/5 xl:h-4/5 shadow-lg",
    policy: "w-[80%] h-[80%] max-h-full shadow-lg overflow-y-auto",
  };

  // Function to determine container size based on window width
  const determineContainerSize = () => {
    if (size) return; // Do not adjust size if it's explicitly set

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth < 640 || windowHeight < 480) {
      setContainerSize("small");
    } else if (windowWidth < 1024 || windowHeight < 768) {
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
    <div className={`fixed inset-0 flex justify-center items-start overflow-hidden ${className || ""}`}>
      <Card
        className={`${containerClass} flex flex-col overflow-hidden`}
        isBlurred
      >
        <CardBody className="flex-grow overflow-hidden mb-2">
          {children}
        </CardBody>
      </Card>
    </div>
  );
};

export default BaseContainer;
