import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface CityInputWrapper {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CityInputWrapper: React.FC<CityInputWrapper> = ({ children }) => {
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
        width: "150",
      }}
      >
        {children}
      </CardBody>
    </Card>
  );
};

export default CityInputWrapper;
