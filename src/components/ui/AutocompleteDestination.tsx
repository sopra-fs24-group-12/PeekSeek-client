import React from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useAsyncList} from "@react-stately/data";
import ContentWrapper from "./ContentWrapper";


type SWCharacter = {
  name: string;
};

export default function InputDestination() {
  let list = useAsyncList<SWCharacter>({
    async load({signal, filterText}) {
      if (!filterText.trim()) return { items: [] };
      
      // First fetch from backend if destination data already exists-- change link
      let res = await fetch(`https://swapi.py4e.com/api/people/?search=${filterText}`, {signal});
      let json = await res.json();

      // If destination data is not in backend, query Google Maps JS API
      if (json.length === 0) {
        res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${filterText}&key=AIzaSyD6hmWF1JFPQdOki`, { signal });
        json = await res.json();
        return { items: json.predictions.map((city: any) => ({ name: city.description })) };
      }

      return { items: json.results, };
    },
  });

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
          onInputChange={list.setFilterText}
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
