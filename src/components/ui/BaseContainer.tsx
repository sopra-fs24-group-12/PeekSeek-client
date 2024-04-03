import React from "react";
import {Card, CardBody} from "@nextui-org/react";

type ContainerSize = 'small' | 'large';

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: ContainerSize;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ className, children, size = 'large' }) => {
  const containerClasses = {
    large: 'w-[90%] h-[90%] overflow-auto shadow-lg',
    medium: 'w-3/4 h-3/4 overflow-auto shadow-lg',
    small: 'max-w-sm h-auto overflow-auto shadow-lg',
  };

  const containerClass = containerClasses[size];

  return (
    <div className={`fixed inset-0 flex justify-center items-center ${className || ''}`}>
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
