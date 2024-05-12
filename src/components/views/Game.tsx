import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Client } from "@stomp/stompjs";
import { Library } from "@googlemaps/js-api-loader";
import { getWebsocketDomain } from "helpers/getDomain";
import { notification } from "antd";
import { ThreeDots } from "react-loader-spinner";


//imports for UI
import BaseContainer from "../ui/BaseContainer";
import BackButton from "components/ui/BackButton";
import GameButton from "components/ui/GameButton";
import GameSubmitButton from "components/ui/GameSubmitButton";
import Timer from "../ui/Timer";
import { Progress, CircularProgress, Chip } from "@nextui-org/react";
//imports for Google Maps API
import { GoogleMap as ReactGoogleMap, LoadScript, StreetViewPanorama, Marker } from "@react-google-maps/api";
import { GoogleMapStyle as googleMapsStyling } from "../../assets/GoogleMapStyle";

const containerStyle = {
  width: "100%",
  height: "100%",
};

//TODO: timer, websocket, async? await? since at first it loads zurich, then the actual location

const API_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libs: Library[] = ["places"];

function MyGoogleMap() {

  const { gameId } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState("Landmark");
  const [cityName, setCityName] = useState("Zurich, Switzerland");
  const [roundDurationSeconds, setRoundDurationSeconds] = useState(0);
  const [currentRound, setCurrentRound] = useState();
  const [nrOfRounds, setNrOfRounds] = useState();
  const [notificationApi, contextHolder] = notification.useNotification();

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pitch, setPitch] = useState(0);
  const [heading, setHeading] = useState(0);
  const [resLatNe, setResLatNe] = useState(47.434665);
  const [resLngNe, setResLngNe] = useState(8.625452899999999);
  const [resLatSw, setResLatSw] = useState(47.32021839999999);
  const [resLngSw, setResLngSw] = useState(8.448018099999999);
  const [mapCenter, setMapCenter] = useState({ lat: 47.3768866, lng: 8.541694 });
  const [mapCenterStart, setMapCenterStart] = useState({ lat: 47.3768866, lng: 8.541694 });
  const [map, setMap] = useState(null);
  const [streetView, setStreetView] = useState(null);
  const [noSubmission, setNoSubmission] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [submissionDone, setSubmissionDone] = useState((localStorage.getItem("submissionDone") !== "false"));
  const [currQuestNr, setQuestNr] = useState(parseInt(localStorage.getItem("currentQuest"))-1);
  const openNotification = (message: string) => {
    notificationApi.open({
      message: message,
      duration: 2,
    });
  };

  useEffect(() => {
    //only for dev purposes
    // localStorage.setItem("token", "2ae5e306-e333-468d-8939-a4292601d694");
    // localStorage.setItem("username", "a");

    async function fetchData() {
      try {
        const headers = {
          "Authorization": localStorage.getItem("token"),
        };
        console.log("Game ID:", headers.Authorization);
        const response = await api.get("/games/" + gameId + "/round", { headers });
        console.log("API Response:", response.data);
        setQuest(response.data.quest);
        setCityName(response.data.geoCodingData.formAddress);
        setRoundDurationSeconds(response.data.roundTime);
        setLat(response.data.geoCodingData.lat);
        setLng(response.data.geoCodingData.lng);
        setResLatNe(response.data.geoCodingData.resLatNe);
        setResLngNe(response.data.geoCodingData.resLngNe);
        setResLatSw(response.data.geoCodingData.resLatSw);
        setResLngSw(response.data.geoCodingData.resLngSw);
        setMapCenter({ lat, lng });
        setQuestNr(parseInt(localStorage.getItem("currentQuest"), 10))
      } catch (error) {
        alert(
          `Something went wrong while fetching round information: \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }
    }

    fetchData();
  }, []);
  console.log("QuestNr:"+ {currQuestNr})
  useEffect(() => {
    const sendRequest = async () => {
      const headers = {
        "Authorization": localStorage.getItem("token"),
      };

      try {
        await api.put(`/games/${gameId}/active`, null, { headers });
      } catch (error) {
        alert(
          `You were kicked due to inactivity. \n${handleError(error)}`,
        );
        localStorage.clear();
        navigate("/landing");
      }
    };

    sendRequest();

    const intervalId = setInterval(() => {
      sendRequest();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let client = new Client();
    const websocketUrl = getWebsocketDomain();
    client.configure({
      brokerURL: websocketUrl,
      debug: function(str) {
        console.log(str);
      },
      onConnect: () => {
        const destination = "/topic/games/" + gameId;
        const timerDestination = "/topic/games/" + gameId + "/timer";
        client && client.subscribe(destination, (message) => {
          let messageParsed = JSON.parse(message.body);
          if (messageParsed.status === "voting") {
            localStorage.setItem("submissionDone", "false");
            navigate(`/submissions/${gameId}/`);
          } else if (messageParsed.status === "left") {
            openNotification(messageParsed.username + " left");
          } else if (messageParsed.status === "game_over") {
            localStorage.setItem("submissionDone", "false");
            navigate("/gamesummary/" + messageParsed.summaryId);
          }
        });
        client && client.subscribe(timerDestination, (message) => {
          let messageParsed = JSON.parse(message.body);
          console.log("Received message from topic 2:", messageParsed);
          setRemainingTime(messageParsed.secondsRemaining);
        });
      },

    });
    client.activate();

    return () => {
      client && client.deactivate();
    };
  }, []);

  const calculateProgressValue = () => {

    return (remainingTime / roundDurationSeconds) * 100;
  };
  const getIndicatorClass = () => {
    if(remainingTime <= 3){
      return "pulse-animation";
    }
    else if (remainingTime <= 9) {
      return "red-color";
    } else if (remainingTime <= 10) {
      return "slow-pulse-animation";
    } else {
      return "stroke-white";
    }
  };
  const circularProgressStyles = {
    svg: "w-28 h-28 drop-shadow-md",
    indicator: getIndicatorClass(),
    track: "stroke-white/10",
    value: "text-xl font-semibold text-white",
  };


  console.log("rounddurationseconds: ", roundDurationSeconds);
  const handleCenterChanged = (map) => {
    if (map) {
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
      "Authorization": localStorage.getItem("token"),
    };
    const body = JSON.stringify({ lat, lng, heading, pitch, noSubmission });
    try {
      localStorage.setItem("currentQuest", String(currQuestNr+1))
      const response = await api.post("games/" + gameId + "/submission", body, { headers });
      console.log("API Response:", response.data);
      //navigate("/waiting/" + gameId);
      localStorage.setItem("submissionDone", "true");
      setSubmissionDone(true);
    } catch (error) {
      alert(
        `There was an error during the submission. \n${handleError(error)}`,
      );
    }
  }

  const submitNow = () => {
    console.log("Successfully submitted");
    console.log("Latitude: " + lat);
    console.log("Longitude: " + lng);
    console.log("Heading: " + heading);
    console.log("Pitch: " + pitch);
    submit();
  };

  function submitEmptyNow() {
    console.log("Can't find it submission button clicked!");
    setNoSubmission(true); // This sets the state
  }

  useEffect(() => {
    if (noSubmission) {
      console.log(`Setting noSubmission to: ${noSubmission}`);
      submit(); // Perform the submission after state update
      setNoSubmission(false); // Optionally reset if needed
    }
  }, [noSubmission]); // This effect runs only when noSubmission changes

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      {contextHolder}
      {submissionDone ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center">
            <ThreeDots
              visible={true}
              height={80}
              width={80}
              color="white"
              radius={9}
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div className="text-white mt-4">Waiting for participants to submit...</div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen w-screen flex flex-col items-center">
          {contextHolder}
          {/*<div className="absolute top-4 left-4">
        <BackButton />
      </div>*/}
          <div className="w-3/4 flex flex-col items-center">
            <BaseContainer size="medium" className="flex flex-col items-center mb-32">
              <Progress
                aria-label="Progress"
                // disableAnimation
                maxValue= {parseInt(localStorage.getItem("totalQuests"), 10)}
                value={currQuestNr}
                color="success"
                className="absolute right-0 top-0 w-full" />
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
                        new window.google.maps.LatLng(resLatNe, resLngNe),   // Northeast
                      );
                      map.fitBounds(bounds);
                      map.setOptions({ restriction: { latLngBounds: bounds, strictBounds: true } });
                      setMap(map);
                      map.set("styles", googleMapsStyling);
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
            <div className="w-3/4 flex items-center justify-between px-4 absolute bottom-16" style={{ minHeight: '10vh'}}>
              <div className="flex-1 flex justify-start">
                <GameButton onClick={submitEmptyNow} />
              </div>
              <div className="flex-1 flex justify-center">
                <CircularProgress
                  classNames={circularProgressStyles}
                  size="md"
                  value={calculateProgressValue()}
                  valueLabel={`${remainingTime}s`}
                  strokeWidth={3}
                  showValueLabel={true}
                />
              </div>
              <div className="flex-1 flex justify-end">
                <GameSubmitButton onClick={submitNow} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGoogleMap;