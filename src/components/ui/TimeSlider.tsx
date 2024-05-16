import React from "react";
import PropTypes from "prop-types";
import { Slider } from "@nextui-org/react";
import FlexWrapper from "./FlexWrapper";

interface TimeSliderProps {
  selectedDuration: number;
  setRoundDurationSeconds: (seconds: number) => void;
  disabled?: boolean;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ selectedDuration, setRoundDurationSeconds, disabled }) => {
  const minValue = 30;
  const maxValue = 180;
  const step = 30;

  const handleSliderChange = (value: number) => {
    if (!disabled) {
      setRoundDurationSeconds(value);
    }
  };

  const marks = [
    { value: 30, label: "30s" },
    { value: 60, label: "1min" },
    { value: 90, label: "1.5min" },
    { value: 120, label: "2min" },
    { value: 150, label: "2.5min" },
    { value: 180, label: "3min" },
  ];

  console.log("TimeSlider selectedDuration:", selectedDuration);

  return (
    <FlexWrapper>
      <div className="flex flex-col gap-4 w-full">
        <h6 className="font-bold text-center mt-2 mb-4">Time per Round</h6>
        <Slider
          size="lg"
          step={step}
          minValue={minValue}
          maxValue={maxValue}
          defaultValue={120}  // server default is 60, so overrides this
          value={selectedDuration}
          onChange={handleSliderChange}
          showTooltip={false}
          showOutline={true}
          showSteps={true}
          marks={marks}
          className={`max-w-4xl w-full ${disabled ? "cursor-not-allowed" : "cursor-grab"}`}
          classNames={{
            base: `max-w-md gap-3 ${disabled ? "cursor-not-allowed" : "cursor-grab"}`,
            filler: "bg-gradient-to-r from-orange-200 to-orange-600",
            track: "border-s-orange-200",
            labelWrapper: "mb-6",
            label: "font-medium text-default-700 text-medium mt-6",
            value: "font-medium text-default-500 text-small",
            thumb: [
              `${disabled ? "bg-gray-400" : "bg-gradient-to-r from-orange-200 to-orange-600"} !important`,
              "data-[dragging=true]:shadow-lg data-[dragging=true]:shadow-black/20",
              "data-[dragging=true]:scale-125 w-7 data-[dragging=true]:h-7 data-[dragging=true]:after:h-6 data-[dragging=true]:after:w-6",
              `${disabled ? "cursor-not-allowed" : "cursor-grab"}`,
            ],
            step: "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
          }}
        />
      </div>
    </FlexWrapper>
  );
};

TimeSlider.propTypes = {
  selectedDuration: PropTypes.number.isRequired,
  setRoundDurationSeconds: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TimeSlider;
