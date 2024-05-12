import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ScrollableContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <Card
      isBlurred
    >
      <CardBody style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "500px",
        overflowY: "visible",
        width: "100%",
      }}
      >
        {children}
      </CardBody>
    </Card>
  );
};

export default ScrollableContentWrapper;
