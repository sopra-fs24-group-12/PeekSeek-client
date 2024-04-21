import React from "react";
import {Input} from "@nextui-org/react";
import {SearchIcon} from "./SearchIcon";

const InputDestination: React.FC = () => {
  return (
    <div className="w-[400px] h-[120px] px-8 rounded-2xl flex flex-col justify-center items-center bg-gradient-to-tr from-gray-300 to-gray-200 text-white shadow-lg">
        <label htmlFor="destination" className="flex text-black mb-2 font-semibold text-sm uppercase">
        Your destination
      </label>
      <Input
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
        >
        </Input>
    </div>
  );
}

export default InputDestination;
