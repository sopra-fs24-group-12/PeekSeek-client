import React, {useEffect, useState} from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Lobby } from "types";
import JoinButton from "components/ui/JoinButton";
import { useNavigate, useParams } from "react-router-dom";

const colors = ["default", "secondary"];

const Lob = ({ lobby }: { lobby: Lobby }) => (
  <div className="player container">
    <div className="player name">{lobby.name}</div>
    <div className="player id">id: {lobby.id}</div>
    <div className="player username">{lobby.joinedParticipants}</div>
  </div>
);

Lob.propTypes = {
  lobby: PropTypes.object,
};

export default function App() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = React.useState("default");
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [selectedLobbyId, setSelectedLobbyId] = useState();

  const handleSelectionChange = (selectedKeys) => {
    // Assuming single selection mode, get the first selected key
    //alert(selectedKeys);
    const selectedKey = selectedKeys[0];
    setSelectedLobbyId(selectedKeys);
    console.log("selected key" + selectedKeys.values);
    //alert(selectedKey);
  };

  const handleClick = () => {
    console.log('Button clicked!');
    //localStorage.setItem("token");
    //const response = await api.post("/lobbies/" + id + "/join", localStorage.getItem("token"));
    //alert(selectedLobbyId);
    //navigate("/joinuser/" + selectedLobbyId);
    navigate("/join");
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/lobbies");

        //await new Promise((resolve) => setTimeout(resolve, 1000));

        setLobbies(response.data);
        //alert(lobbies);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the lobbies: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the lobbies! See the console for details."
        );
      }
    }

    fetchData();
  }, [lobbies]);

//code umschreiben um daten vom api call hier sichtbar zu machen
//api call im join.tsx, daten vom api call in Lobby table eingeben, und routing auch
  return (
    <div className="flex flex-col gap-3">
      <Table 
        color={"default"}
        selectionMode="single" 
        defaultSelectedKeys={["2"]} 
        aria-label="Example static collection table"
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          <TableColumn>LOBBY NAME</TableColumn>
          <TableColumn>PARTICIPANTS</TableColumn>
        </TableHeader>
        {lobbies && (
                <TableBody>
                    {lobbies.map((lobby: Lobby) => 
                        <TableRow key={lobby.id}>
                            <TableCell>{lobby.name}</TableCell>
                            <TableCell>{lobby.joinedParticipants}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            )}
      </Table>
      <div className="w-full flex justify-center mt-24 mb-4">
    <JoinButton
      onClick={handleClick}/>
    </div>
    </div>
    
  );
}

/*
return (
    <div className="flex flex-col gap-3">
      <Table 
        color={"default"}
        selectionMode="single" 
        defaultSelectedKeys={["2"]} 
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>LOBBY NAME</TableColumn>
          <TableColumn>PARTICIPANTS</TableColumn>
        </TableHeader>
        <TableBody>
          {lobbies.map((lobby: Lobby) => 
              <TableRow key={lobby.id}>
              {<TableCell>{lobby.name}</TableCell>}
          </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}*/

// Lobby table: alles was im response returned wird
//when you create a lobby, set localstorage token of api response
//same with join
//you need id when joinuser/id in url
//look at other way of mapping and try it, maybe you can then extract the id 


