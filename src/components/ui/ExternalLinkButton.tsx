import React from "react";
import { Button, Link } from "@nextui-org/react";

interface ExternalLinkButtonProps {
  url: string;
  label: string;
}

const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({ url, label }) => {
  if (label.length > 39) {
    label = label.slice(0, 36) + "...";
  }

  return (
    <Button
      size={"md"}
      href={url}
      as={Link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[300px] shadow-md justify-start text-left"
      showAnchorIcon
      variant="flat"
      radius="md"
      color="warning"
      style={{
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
    >
      {label}
    </Button>
  );
};

export default ExternalLinkButton;