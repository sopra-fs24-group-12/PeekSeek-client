import React from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from "@nextui-org/react";
import FlexWrapper from "./FlexWrapper";

const TimeButtons = ({ selectedDuration, setRoundDurationSeconds, disabled }) => {
  const durations = [
    { label: "30s", value: 30 },
    { label: "1min", value: 60 },
    { label: "2min", value: 120 },
    { label: "3min", value: 180 },
  ];

  return (
    <FlexWrapper>
      <h6 className="font-bold text-center mt-2 mb-4">Time per round</h6>
      <ButtonGroup className="mb-2">
        {durations.map(time => (
          <Button
            key={time.value}
            disabled={disabled}
            className={`text-black font-semibold text-small shadow-lg ${selectedDuration === time.value ? "border-4 border-green-500 bg-orange-700" : ""}`}
            style={{
              margin: "1px",
              background: "linear-gradient(to bottom, #fbcf9d 0%, #f8c480 20%, #e59455 50%, #e07738 80%, #fbcf9d 100%)",
              boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.6)", 
              transform: "perspective(1px) translateZ(0)", 
              transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
            }}
            onClick={() => {
              if (!disabled) { 
                setRoundDurationSeconds(time.value);
              }
            }}
          >
            {time.label}
          </Button>
        ))}
      </ButtonGroup>
    </FlexWrapper>
  );
};

TimeButtons.propTypes = {
  selectedDuration: PropTypes.number.isRequired,
  setRoundDurationSeconds: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TimeButtons;
