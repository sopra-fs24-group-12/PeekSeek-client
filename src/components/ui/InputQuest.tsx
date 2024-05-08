import React from "react";
import { Input } from "@nextui-org/react";
import ScrollableContentWrapper from "./ScrollableContentWrapper";

const InputQuest: React.FC = () => {
  // State for multiple quests
  const [quests, setQuests] = React.useState(["", "", "", ""]); // Initial state: 4 empty input fields

  // Handler for input change
  const handleQuestChange = (index: number, value: string) => {
    console.log(`Input changed at index ${index} with value: '${value}'`);

    const newQuests = [...quests];
    newQuests[index] = value;
    
    // Add a new input field if typing in the last one
    if (index === quests.length - 1 && value !== "") {
      newQuests.push("");
    }

    setQuests(newQuests);
  };


  return (
    <ScrollableContentWrapper>
      <div style={{ overflowY: "visible", maxHeight: "500px", width: "95%" }}>
      <h6 className="font-bold text-center mt-2 mb-4">Your Quests</h6>
      {quests.map((quest, index) => (
        <Input
          isClearable
          key={index}
          placeholder={`Quest #${index + 1}`}
          value={quest}
          onChange={(e) => handleQuestChange(index, e.target.value)}
          className="mb-2 ml-4 mr-4"
        />
      ))}
      </div>
    </ScrollableContentWrapper>
  );
};

export default InputQuest;
