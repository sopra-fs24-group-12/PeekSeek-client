import React from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from "@nextui-org/react";
import ContentWrapper from "./ContentWrapper";

const TimeButtons = ({ selectedDuration, setRoundDurationSeconds }) => {
  const durations = [
    { label: "30s", value: 30 },
    { label: "1min", value: 60 },
    { label: "2min", value: 120 },
    { label: "3min", value: 180 },
  ];

  return (
    <ContentWrapper>
      <h6 className="font-bold text-center mt-2 mb-4">Time per round</h6>
      <ButtonGroup>
        {durations.map(time => (
          <Button
            key={time.value}
            className={`bg-gradient-to-tr from-orange-500 to-orange-200 text-black shadow-lg ${selectedDuration === time.value ? "border-4 border-green-500 bg-orange-700" : ""}`}
            onClick={() => setRoundDurationSeconds(time.value)}
          >
            {time.label}
          </Button>
        ))}
      </ButtonGroup>
    </ContentWrapper>
  );
};

TimeButtons.propTypes = {
  selectedDuration: PropTypes.number.isRequired,
  setRoundDurationSeconds: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TimeButtons;
