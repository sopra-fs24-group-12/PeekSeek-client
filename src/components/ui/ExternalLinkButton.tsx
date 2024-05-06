import React from "react";
import { Button, Link } from "@nextui-org/react";

interface ExternalLinkButtonProps {
  url: string;
  label: string;
}

const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({ url, label }) => {
  return (
    <Button
      href={url}
      as={Link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[300px] bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      showAnchorIcon
      variant="solid"
      radius="lg"

    >
      {label}
    </Button>
  );
};

export default ExternalLinkButton;