import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import HowToPlayModal from "components/ui/HowToPlayModal";
import ErrorMessageModal from "components/ui/ErrorMessageModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input, Button, useDisclosure, Progress } from "@nextui-org/react";
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";
import ExternalLinkButton from "../ui/ExternalLinkButton";
import BackDashboardButton from "../ui/BackDashboardButton";
import { useParams } from "react-router-dom";
import StartButton from "../ui/StartButton";
import { MutatingDots, ThreeDots, DNA, BallTriangle, TailSpin } from "react-loader-spinner";
import { LoadScript, Marker, GoogleMap as ReactGoogleMap} from '@react-google-maps/api';
import { Library } from "@googlemaps/js-api-loader";

const API_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libs: Library[] = ["places"];

const GameSummary = () => {
  // Mock data for city and number of quests
  const [city, setCity] = useState("Rome");
  const [nrOfQuests, setNrOfQuests] = useState(5);
  const { summaryId } = useParams();
  const [externalLinks, setExternalLinks] = useState([]);
  const [successfulRounds, setSuccessfulRounds] = useState(0);
  const [staticMap, setStaticMap] = useState("");
  const lats = [];
  const lngs = [];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [resLatNe, setResLatNe] = useState(0);
  const [resLngNe, setResLngNe] = useState(0);
  const [resLatSw, setResLatSw] = useState(0);
  const [resLngSw, setResLngSw] = useState(0);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [mapCenter, setMapCenter] = useState({ lat: 47.3768866, lng: 8.541694 });
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/summaries/" + summaryId);

        const linkList = response.data.quests.map((quest, index) => {
          return { url: quest.link, label: index + 1 + ": " + quest.description + " found by " + quest.name };
        });
        setResLatNe(response.data.resLatNe);
        setResLngNe(response.data.resLngNe);
        setResLatSw(response.data.resLatSw);
        setResLngSw(response.data.resLngSw);
        setLat(parseFloat(response.data.lat));
        setLng(parseFloat(response.data.lng));
        setMapCenter({ lat, lng });
        setExternalLinks(linkList);
        setSuccessfulRounds(linkList.length);
        setCity(response.data.cityName);
        setNrOfQuests(response.data.roundsPlayed);
        console.log("Response data:", response.data);
        response.data.quests.forEach(quest => {
          lats.push(quest.lat);
          lngs.push(quest.lng);
        });
        const newMarkers = lats.map((lat, index) => new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(lngs[index]) },
          map: map,
        }));
        setMarkers(newMarkers);
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
        console.log("Error Modal Open:", errorModalOpen, "Message:", errorMessage);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setPageLoading(false);
    }, 1500
    )
  }, []);

  

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center">
      {pageLoading ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col items-center">
            <TailSpin
              visible={true}
              height={80}
              width={80}
              color="white"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </div>
      ) : (<>
        {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} errorMessage={errorMessage} />}
        <BaseContainer size="large" className="flex flex-col items-center">
          <Progress
            aria-label="Progress"
            value={100}
            color="success"
            className="absolute right-0 top-0 w-full" />
          <div className="p-4 flex w-full items-center">
            <div className="w-1/6">
            </div>
            <div className="w-2/3 text-center">
              <h1 className="text-3xl font-bold text-gray-700">You&apos;ve just explored {city} in {nrOfQuests} round(s) of
                which {successfulRounds} had a winning submission!</h1>
            </div>
            <div className="w-1/6">
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/3 p-4 flex flex-col items-center justify-end h-full space-y-4">
              {externalLinks.map(link => (
                <ExternalLinkButton key={link.url} url={link.url} label={link.label} />
              ))}
            </div>
            <div className="w-2/3 flex flex-col p-4 h-screen h-80vh">
            {lat && lng && (
              <LoadScript googleMapsApiKey={API_Key} libraries={libs}>
                <ReactGoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  zoom={15}
                  onLoad={(map) => {
                    const bounds = new window.google.maps.LatLngBounds(
                      new window.google.maps.LatLng(resLatSw, resLngSw),  // Southwest
                      new window.google.maps.LatLng(resLatNe, resLngNe),   // Northeast
                    );
                    map.fitBounds(bounds);
                    setMap(map);
                  }}
                  center={mapCenter}
                >
                  {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position} />
                  ))}
                </ReactGoogleMap>
              </LoadScript>
              )}
            </div>
          </div>
          <Button
            onPress={onOpen}
            className="absolute bottom-2 right-2 p-2 sm rounded-full bg-transparent"
            isIconOnly
          >
            <InfoCircleTwoTone style={{ fontSize: "20px"}}/>
          </Button>
          <HowToPlayModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            context="gamesummary"  />
          <div className="w-full flex justify-between px-4 bottom-8 mb-4 mt-auto" style={{ bottom: "16px" }}>
            <BackDashboardButton/>
          </div>
        </BaseContainer>
      </>)}
    </div>
  );
};

export default GameSummary;