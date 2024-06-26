import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge"
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";

class ExtendedDictionary {
  data: { [key: number]: string };

  constructor() {
    this.data = {};
  }

  set(key: number, value: string): void {
    this.data[key] = value;
  }

  get(key: number): string | undefined {
    return this.data[key];
  }

  delete(key: number): void {
    delete this.data[key];
  }

  toJSON(): string {
    return JSON.stringify(this.data);
  }

  hasKey(key: number): boolean {
    return this.data.hasOwnProperty(key);
  }
}

interface SubmitButtonProps {
  voteData: ExtendedDictionary,
  gameId: string,
  setSubmissionDone: Dispatch<SetStateAction<boolean>>;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({voteData, gameId, setSubmissionDone}) => {
  const navigate = useNavigate();

  const onClick = async () => {
    const headers = {
      "Authorization": localStorage.getItem("token"),
    };

    try {
      const formattedBody = {
        votes: voteData.data
      };

      const body = JSON.stringify(formattedBody);

      console.log(body);
      const response = await api.post("/games/" + gameId + "/voting", body, {headers});
      // console.log("Submitted votes");
      //navigate("/waiting/" + gameId);
      localStorage.setItem("submissionDone", "true");
      setSubmissionDone(true);
    } catch (error) {
      alert(
        `Something went wrong while submitting your votes: \n${handleError(error)}`
      );
    }
  }

  return (
    <Button
      className="items-center bg-gradient-to-tr from-yellow-500 to-yellow-200 text-black shadow-lg"
      radius="full"
      style={{
        fontFamily: "'Lato'",
        fontWeight: 400,
      }}
      size = "lg"
      color = "warning"
      onClick={onClick}
    >
      Submit your Pick!
    </Button>
  );
};

export default SubmitButton;
