import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <Card
      // css={{ mw: "100%", p: "$6", boxShadow: "$lg" }} // Adjust maxWidth, padding, and boxShadow as needed
      isBlurred
    >
      <CardBody style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "450px",
        overflowY: "auto",
        width: "100%"
      }}
      >
        {children}
      </CardBody>
    </Card>
  );
};

export default ContentWrapper;