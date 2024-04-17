import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Client } from '@stomp/stompjs';

//imports for UI
import BaseContainer from "../ui/BaseContainer";
import BackButton from "components/ui/BackButton";
import GameButton from "components/ui/GameButton";
import GameSubmitButton from "components/ui/GameSubmitButton";
import CreateButton from "components/ui/CreateButton";

//imports for Google Maps API
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};
const API_Key = "";


const Game = () => {



  const {lobbyId} =  useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState("");
  const [cityName, setCityName] = useState("");
  const [roundDurationSeconds, setRoundDurationSeconds] = useState();
  const [currentRound, setCurrentRound] = useState();
  const [nrOfRounds, setNrOfRounds] = useState();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [resLatNe, setResLatNe] = useState("");
  const [resLngNe, setResLngNe] = useState("");
  const [resLatSw, setResLatSw] = useState("");
  const [resLngSw, setResLngSw] = useState("");

  const [mapCenter, setMapCenter] = useState({lat: 47.3768866, lng: 8.541694});


  // useEffect(() => {
  //
  //   //only for dev purposes
  //   localStorage.setItem("token", "1");
  //   localStorage.setItem("username", "admin");
  //
  //   async function fetchData() {
  //     const headers = {
  //       "Authorization": localStorage.getItem("token"),
  //     };
  //     const response = await api.get(`/games/${lobbyId}/round`, { headers });
  //     console.log("API Response:", response.data);
  //
  //
  //     setQuest(response.data.currentRound);
  //     setCityName(response.data.geoCodingData.formAddress);
  //     setRoundDurationSeconds(response.data.roundDurationSeconds);
  //     setLat(response.data.geoCodingData.lat);
  //     setLng(response.data.geoCodingData.lng);
  //     setResLatNe(response.data.geoCodingData.resLatNe);
  //     setResLngNe(response.data.geoCodingData.resLngNe);
  //     setResLatSw(response.data.geoCodingData.resLatSw);
  //     setResLngSw(response.data.geoCodingData.resLngSw);
  //     // setMapCenter({lat,lng});
  //
  //   }
  //   fetchData();
  // }, [])

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      <div className="absolute top-4 left-4">
        <BackButton/>
      </div>
      <div className="w-3/4 flex flex-col items-center">
        <BaseContainer size="medium" className="flex flex-col items-center mb-20">
          <h3 className="text-xl font-bold my-4">Find a Landmark in Rome!</h3>
          <LoadScript googleMapsApiKey={API_Key}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
            >
            </GoogleMap>
          </LoadScript>
        </BaseContainer>
        <div className="w-3/4 flex justify-between px-4 absolute bottom-16">
          <GameButton />
          <GameSubmitButton />
        </div>
      </div>
    </div>
  );
};


export default Game;
