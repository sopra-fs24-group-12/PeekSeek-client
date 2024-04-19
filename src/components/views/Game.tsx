import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { Library } from "@googlemaps/js-api-loader";

//imports for UI
import BaseContainer from "../ui/BaseContainer";
import BackButton from "components/ui/BackButton";
import GameButton from "components/ui/GameButton";
import GameSubmitButton from "components/ui/GameSubmitButton";

//imports for Google Maps API
import { GoogleMap as ReactGoogleMap, LoadScript, StreetViewPanorama , Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%"
};

//TODO: timer, websocket, async? await? since at first it loads zurich, then the actual location

const API_Key = "AIzaSyCV8oO7Ljb9jVEL1TYfIJwsNfDlY8r6nbg";

const libs: Library[] = ["places"];

function MyGoogleMap() {

  const {gameId} =  useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState("Landmark");
  const [cityName, setCityName] = useState("Zurich, Switzerland");
  const [roundDurationSeconds, setRoundDurationSeconds] = useState();
  const [currentRound, setCurrentRound] = useState();
  const [nrOfRounds, setNrOfRounds] = useState();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pitch, setPitch] = useState(0);
  const [heading, setHeading] = useState(0);
  const [resLatNe, setResLatNe] = useState(47.434665);
  const [resLngNe, setResLngNe] = useState(8.625452899999999);
  const [resLatSw, setResLatSw] = useState(47.32021839999999);
  const [resLngSw, setResLngSw] = useState(8.448018099999999);
  const [mapCenter, setMapCenter] = useState({lat: 47.3768866, lng: 8.541694});
  const [mapCenterStart, setMapCenterStart] = useState({lat: 47.3768866, lng: 8.541694});
  const [map, setMap] = useState(null);
  const [streetView, setStreetView] = useState(null);
  const [noSubmission, setNoSubmission] = useState(false);

  useEffect(() => {
    //only for dev purposes
    localStorage.setItem("token", "14cc311e-8ecc-458f-86e0-7c45955f8a3f");
    localStorage.setItem("username", "b");
  
    async function fetchData() {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };
      console.log("Game ID:", headers.Authorization)
      const response = await api.get("/games/" + gameId + "/round", { headers });
      console.log("API Response:", response.data);
      setQuest(response.data.quest);
      setCityName(response.data.geoCodingData.formAddress);
      setRoundDurationSeconds(response.data.roundDurationSeconds);
      setLat(response.data.geoCodingData.lat);
      setLng(response.data.geoCodingData.lng);
      setResLatNe(response.data.geoCodingData.resLatNe);
      setResLngNe(response.data.geoCodingData.resLngNe);
      setResLatSw(response.data.geoCodingData.resLatSw);
      setResLngSw(response.data.geoCodingData.resLngSw);
      setMapCenter({lat,lng});
    }
    fetchData();
  }, [])
  

  //TODO: New file for this
  const bareMapStyle = [
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ];
  
  const handleCenterChanged = (map) => {
    if(map){
      // Get the new center of the map
      const newCenter = map.getCenter();
      
      const tempLat = newCenter.lat();
      const tempLng = newCenter.lng();

      // Get the latitude and longitude of the new center
      setLat(tempLat);
      setLng(tempLng);
      
      // Now you can use lat and lng as needed
      console.log("New center latitude: " + tempLat);
      console.log("New center longitude: " + tempLng);
    }
  };

  async function submit() {
    const headers = {
      "Authorization": localStorage.getItem("token")
    };
    const body = JSON.stringify({lat, lng, heading, pitch});
    const response = await api.post("games/" + gameId + "/submission", body, { headers });
    console.log("API Response:", response.data);
    //navigate(`/games/${lobbyId}/round`);
  }

  const submitNow = () => {
    console.log("Successfully submitted");
    console.log("Latitude: " + lat);
    console.log("Longitude: " + lng);
    console.log("Heading: " + heading);
    console.log("Pitch: " + pitch);
    
    submit();
  };
  
  const submitEmptyNow = () => {
    console.log("Can't find it submission button clicked!");
    setNoSubmission(true);
    console.log(`Setting noSubmission to + ${noSubmission} `);
    submit();
  }

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      <div className="absolute top-4 left-4">
        <BackButton/>
      </div>
      <div className="w-3/4 flex flex-col items-center">
        <BaseContainer size="medium" className="flex flex-col items-center mb-20">
          <h3 className="text-xl font-bold my-4">Find a {quest} in {cityName}!</h3>
          {lat && lng && (
            <LoadScript googleMapsApiKey={API_Key} libraries={libs}>
              <ReactGoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={(map) => {
                  const bounds = new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(resLatSw, resLngSw),  // Southwest
                    new window.google.maps.LatLng(resLatNe, resLngNe)   // Northeast
                  );
                  map.fitBounds(bounds);
                  map.setOptions({ restriction: { latLngBounds: bounds, strictBounds: true } });
                  setMap(map);
                  map.set("styles", bareMapStyle);
                }}
                onCenterChanged={() => handleCenterChanged(map)}
              >
                <StreetViewPanorama
                  onLoad={(panorama) => {
                    setStreetView(panorama);
                    panorama.addListener("position_changed", () => {
                      const newPosition = panorama.getPosition();
                      const newLat = newPosition.lat();
                      const newLng = newPosition.lng();

                      // Update the lat and lng states
                      setLat(newLat);
                      setLng(newLng);

                      // Now you can use newLat and newLng as needed
                      console.log("New street view latitude: " + newLat);
                      console.log("New street view longitude: " + newLng);
                    });
                    panorama.addListener("pov_changed", () => {
                      const pov = panorama.getPov();
                      const newPitch = pov.pitch;
                      const newHeading = pov.heading;

                      // Update the pitch and heading states
                      setPitch(newPitch);
                      setHeading(newHeading);

                      // Now you can use newPitch and newHeading as needed
                      console.log("New street view pitch: " + newPitch);
                      console.log("New street view heading: " + newHeading);
                    });
                  }}
                />
              </ReactGoogleMap>
            </LoadScript>
          )}
        </BaseContainer>
        <div className="w-3/4 flex justify-between px-4 absolute bottom-16">
          <GameButton onClick={submitEmptyNow}/>
          <GameSubmitButton onClick={submitNow}/>
        </div>
      </div>
    </div>
  );
};

export default MyGoogleMap;
