import React from "react";
import { Button, Link, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import {ChevronDownIcon} from "./ChevronDownIcon";

interface MapsRouteButtonProps {
  normal_order_link: string;
  shortest_path_link: string;
}

const MapsRouteButton: React.FC<MapsRouteButtonProps> = ({ normal_order_link, shortest_path_link }) => {

  const [selectedOption, setSelectedOption] = React.useState(new Set(["Original"]));

  const descriptionsMap = {
    Original:
      "Show directions of route in order of rounds played in this game.",
    Shortest:
      "Show directions of route in shortest possible way to get to all winning places.",
  };

  const labelsMap = {
    Original: "Directions in Order of Rounds",
    Shortest: "Directions in Shortest Distance",
  }

  const selectedOptionValue = Array.from(selectedOption)[0];

  const handleSelectionChange = (keys: any) => {
    setSelectedOption(keys as Set<string>);
  };

  const handleButtonClick = () => {
    const url = selectedOptionValue === "Original" ? normal_order_link : shortest_path_link;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDropdownItemClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <ButtonGroup variant="flat">
      <Button
        size = "lg"
        style={{
          fontFamily: "'Lato'",
          fontWeight: 400,

        }}
        color={"warning"}
        onClick={handleButtonClick}
      >
        {labelsMap[selectedOptionValue]}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            size = "lg"
            style={{
              fontFamily: "'Lato'",
              fontWeight: 400,
            }}
            color={"warning"}
            isIconOnly>
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Directions Options"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
          className="max-w-[300px]"
        >
          <DropdownItem
            style={{
              fontFamily: "'Lato'",
              fontWeight: 400,
            }}
            key="Original"
            description={descriptionsMap["Original"]}
            onClick={() => handleDropdownItemClick(normal_order_link)}
          >
            {labelsMap["Original"]}
          </DropdownItem>
          <DropdownItem
            style={{
              fontFamily: "'Lato'",
              fontWeight: 400,
            }}
            key="Shortest"
            description={descriptionsMap["Shortest"]}
            onClick={() => handleDropdownItemClick(shortest_path_link)}
          >
            {labelsMap["Shortest"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default MapsRouteButton;