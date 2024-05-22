import React, { useCallback, useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import HowToPlayModal from "components/ui/HowToPlayModal";
import ErrorMessageModal from "components/ui/ErrorMessageModal";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { Input, Button, useDisclosure, Progress, Chip } from "@nextui-org/react";
import BaseContainer from "../ui/BaseContainer";
import Leaderboard from "../ui/Leaderboard";
import ExternalLinkButton from "../ui/ExternalLinkButton";
import BackDashboardButton from "../ui/BackDashboardButton";
import { useNavigate, useParams } from "react-router-dom";
import StartButton from "../ui/StartButton";
import { MutatingDots, ThreeDots, DNA, BallTriangle, TailSpin } from "react-loader-spinner";
import { LoadScript, Marker, DirectionsService, DirectionsRenderer, GoogleMap as ReactGoogleMap} from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { set } from "lodash";
import MapsRouteButton from "../ui/MapsRouteButton";

const API_Key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libs: Library[] = ["places"];

const GameSummary = () => {
  const [city, setCity] = useState("NaN");
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
  const [markersURL, setMarkersURL] = useState("");
  const [markersURLunordered, setMarkersURLunordered] = useState("");
  const navigate = useNavigate();


  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [areMarkersOptimized, setAreMarkersOptimized] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/summaries/" + summaryId);
        if(response && response.data){
          console.log("Response data:", response.data);
          const linkList = response.data.quests.map((quest, index) => {
            return { url: quest.link, label: index + 1 + ": " + quest.description + " found by " + quest.name };
          });
          setResLatNe(response.data.resLatNe);
          setResLngNe(response.data.resLngNe);
          setResLatSw(response.data.resLatSw);
          setResLngSw(response.data.resLngSw);
          setLat(parseFloat(response.data.lat));
          setLng(parseFloat(response.data.lng));
          const center = { lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lng) };
          setMapCenter(center);
          console.log("Map Center:", mapCenter);
          setExternalLinks(linkList);
          setSuccessfulRounds(linkList.length);
          setCity(response.data.cityName);
          setNrOfQuests(response.data.roundsPlayed);
          console.log("Response data:", response.data);
          response.data.quests.forEach(quest => {
            lats.push(quest.lat);
            lngs.push(quest.lng);
          });
          const newMarkers = lats.map((lat, index) => ({
            position: { 
              lat: parseFloat(lat), 
              lng: parseFloat(lngs[index]) 
            },
          }));
          setMarkers(newMarkers);
          const baseURL = "https://www.google.com/maps/dir/";
          const waypoints = lats.map((lat, index) => `${lat},${lngs[index]}`).join("/");
          const endOfURL = "/data=!3m1!4b1!4m2!4m1!3e2";
          setMarkersURLunordered(`${baseURL}${waypoints}${endOfURL}`);
        }
      } catch (error) {
        console.log("Error caught:", error.response.data.message);
        setErrorMessage(error.response.data.message);
        setErrorModalOpen(true);
        console.log("Error Modal Open:", errorModalOpen, "Message:", errorMessage);
      }
    }

    fetchData();
  }, [summaryId]);

  const shortestPathMarkers = useCallback((directionsService) => {
    console.log("Markers:", markers);

    const waypoints = markers.slice(1, markers.length - 1).map(marker => ({
      location: marker.position,
      stopover: true,
    }));

    console.log("Waypoints:", waypoints);

    directionsService.route({
      origin: markers[0].position,
      destination: markers[markers.length - 1].position,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: "WALKING",
    }, (response, status) => {
      if (status === "OK") {
        setDirectionsResponse(response);
        const route = response.routes[0];
        const optimizedOrder = route.waypoint_order;
        console.log("Optimized Order:", optimizedOrder);
        const orderedMarks = getOrderedMarkers(markers, optimizedOrder);
        setMarkers(orderedMarks);
        updateMarkersURL(orderedMarks);
        setAreMarkersOptimized(true);
      } else {
        console.error(`error fetching directions ${response}`);
      }
    });
  }, [markers]);

  const getOrderedMarkers = (markers, optimizedOrder) => {

    const orderedMarkers = [markers[0]];

    optimizedOrder.forEach(index => {
      orderedMarkers.push(markers[index + 1]);
    });

    orderedMarkers.push(markers[markers.length - 1]); // ending at the starting point

    console.log("Ordered Markers:", orderedMarkers);

    return orderedMarkers;
  };

  const updateMarkersURL = (orderedMarkers) => {
    const baseURL = "https://www.google.com/maps/dir/";
    const waypoints = orderedMarkers.map(marker => `${marker.position.lat},${marker.position.lng}`).join("/");
    const endOfURL = "/data=!3m1!4b1!4m2!4m1!3e2";
    setMarkersURL(`${baseURL}${waypoints}${endOfURL}`);
  };

  useEffect(() => {
    if (map && markers.length && !areMarkersOptimized) {
      const directionsService = new window.google.maps.DirectionsService();
      shortestPathMarkers(directionsService);
    }
  }, [map, markers, areMarkersOptimized, shortestPathMarkers]);

  useEffect(() => {
    setInterval(() => {
      setPageLoading(false);
    }, 1500
    )
  }, []);

  function handleErrorOnSummaryPage() {
    setErrorModalOpen(false);
    navigate("/landing/");
  }

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
        {errorModalOpen && <ErrorMessageModal isOpen={errorModalOpen} onClose={() => handleErrorOnSummaryPage()} errorMessage={errorMessage} />}
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
            <div className="w-1/3 p-4 flex flex-col items-center h-screen space-y-4">
              <Chip
                classNames={{
                  base: "border-1 customStroke",
                  content: "text-xs text-customStroke font-semibold",
                }}
                variant="dot"
                color="warning"
              >
                WINNING SUBMISSIONS
              </Chip>
              {externalLinks.map(link => (
                <ExternalLinkButton key={link.url} url={link.url} label={link.label} />
              ))}
              <div className="absolute bottom-28 w-full flex flex-col items-center mt-auto space-y-4">
                <Chip
                  classNames={{
                    base: "border-1 customStroke",
                    content: "text-xs text-customStroke font-semibold",
                  }}
                  variant="dot"
                  color="warning"
                >
                  ROUTE DIRECTIONS
                </Chip>
                <MapsRouteButton normal_order_link={markersURLunordered} shortest_path_link={markersURL} nrOfWinningSubmissions={successfulRounds}/>
              </div>
            </div>
            <div className="w-2/3 flex flex-col flex-center p-4 h-screen">
              {lat && lng && markers && (
                <LoadScript googleMapsApiKey={API_Key} libraries={libs}>
                  <ReactGoogleMap
                    mapContainerStyle={{
                      width: "90%",
                      height: "60%",
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
                      <Marker key={index} position={marker.position} title={marker.title} />
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
          <div className="absolute w-full flex justify-between px-4 bottom-2 mt-4" style={{ bottom: "16px" }}>
            <BackDashboardButton/>
          </div>
        </BaseContainer>
      </>)}
    </div>
  );
};

export default GameSummary;
