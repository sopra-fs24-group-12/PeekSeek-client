import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    <Card
      css={{ mw: "100%", p: "$6", boxShadow: "$lg" }} // Adjust maxWidth, padding, and boxShadow as needed
      isBlurred
    >
      <CardBody
        css={{ d: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        {children}
      </CardBody>
    </Card>
  );
};

export default ContentWrapper;