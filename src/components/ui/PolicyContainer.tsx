import React, { useState, useEffect } from "react";
import {Card, CardBody} from "@nextui-org/react";

type ContainerSize = "policy";

interface BaseContainerProps {
  className?: string;
  children: React.ReactNode;
  size?: ContainerSize;
  initialSize?: ContainerSize;
}

const BaseContainer: React.FC<BaseContainerProps> = ({ className, children, size, initialSize = "large" }) => {

  return (
    <div className={"flex items-center justify-center overflow-y-auto w-[80%] h-[80%] max-h-full shadow-lg"}>
      <Card
        className={"flex flex-col overflow-visible"}
        isBlurred
      >
        <CardBody className="flex-grow overflow-a-auto mt-2 mb-2">
          {children}
        </CardBody>
      </Card>
    </div>
  );
};

export default BaseContainer;
