import React, { useState, useEffect } from "react";
import { Input, Dropdown, DropdownItem } from "@nextui-org/react";
import ContentWrapper from "./ContentWrapper";

const DropdownDestination = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/people/?search=${inputValue}`);
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          setSuggestions(json.results.map((item) => item.name));
        } else {
          const mapsResponse = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&key=YOUR_API_KEY`);
          const mapsJson = await mapsResponse.json();
          setSuggestions(mapsJson.predictions.map((item) => item.description));
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
      setLoading(false);
    };
    fetchSuggestions();
  }, [inputValue]);

  return (
    <ContentWrapper>
      <Input
        isClearable
        label="Your Destination"
        placeholder="Type to search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {suggestions.length > 0 && (
        <Dropdown>
          {suggestions.map((suggestion, index) => (
            <DropdownItem key={index} onSelect={() => setInputValue(suggestion)}>
              {suggestion}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </ContentWrapper>
  );
};

export default DropdownDestination;
