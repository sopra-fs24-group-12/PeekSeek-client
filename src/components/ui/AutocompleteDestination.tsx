import React, { useState } from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useAsyncList} from "@react-stately/data";
import ContentWrapper from "./ContentWrapper";


type SWCharacter = {
  name: string;
};

export default function InputDestination() {
  const [inputValue, setInputValue] = useState('');

  let list = useAsyncList<SWCharacter>({
    async load({signal}) {
      if (!inputValue.trim()) return { items: [] };

      try { //TODO: api key variable instead of clear code
        let res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${inputValue}&key=AIzaSyDY0TuMQClRDLGCRtCDCmrse_UZNlar7iY`, { signal });
        let json = await res.json();
        console.log({items: json.predictions.map((city: any) => ({ name: city.description }))})
        return { items: json.predictions.map((city: any) => ({ name: city.description })) };
      } catch (error) {
        console.error('Error fetching data:', error);
        return { items: [] };
      }
    },
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    list.setFilterText(value);
  };

  return (
    <div className="w-[600px] h-[160px] px-8 rounded-2xl flex flex-col justify-center items-center bg-gradient-to-tr from-gray-300 to-gray-200 text-white shadow-lg">
      <label htmlFor="destination" className="flex text-black mb-2 font-semibold text-sm uppercase">
        Your destination
      </label>
      <ContentWrapper>
        <Autocomplete
          className="w-[500px]"
          inputValue={list.filterText}
          isLoading={list.isLoading}
          items={list.items}
          label=" "
          placeholder="Type to search..."
          variant="bordered"
          onInputChange={handleInputChange}
        >
          {(item) => (
            <AutocompleteItem key={item.name} className="capitalize">
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </ContentWrapper>
    </div>
  );
}
