import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface FlexWrapperProps {
  children: React.ReactNode;
}

const FlexWrapper: React.FC<FlexWrapperProps> = ({ children }) => {
  return (
    <Card style={{
      maxWidth: "100%",
      padding: "$6",
      boxShadow: "$lg",
      width: "100%",
      overflow: "visible"
    }}
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

export default FlexWrapper;
