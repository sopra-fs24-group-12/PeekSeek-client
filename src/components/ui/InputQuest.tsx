import React from "react";
import { Input } from "@nextui-org/react";
import ContentWrapper from "./ContentWrapper"; 

const InputQuest: React.FC = () => {
  // State for multiple quests
  const [quests, setQuests] = React.useState(['', '', '', '']); // Initial state with four empty strings for four inputs

  // Handler for input change
  const handleQuestChange = (index: number, value: string) => {
    const newQuests = [...quests];
    newQuests[index] = value;
    setQuests(newQuests);
  };

  return (
    <ContentWrapper>
        <h6 className="font-bold text-center mt-2 mb-4">Your Quests:</h6>
      {quests.map((quest, index) => (
        <Input
          key={index}
          isClearable
          placeholder={`Quest #${index + 1}`}
          value={quest}
          onChange={(e) => handleQuestChange(index, e.target.value)}
          className="mb-2 mr-14"
        />
      ))}
    </ContentWrapper>
  );
};

export default InputQuest;
