/*import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@nextui-org/react";
import { GoogleMap as ReactGoogleMap, StreetViewPanorama, LoadScript } from "@react-google-maps/api";

const google = window.google;

interface StreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  coords: {
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
  };
}

const StreetViewModal: React.FC<StreetViewModalProps> = ({isOpen, onClose, coords}) => {
  const [visible, setVisible] = useState(false);
  const [streetView, setStreetView] = useState(null);
  const { lat, lng, heading, pitch } = coords;
  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);

  const panoramaOptions = {
    disableDefaultUI: false,
    //enableCloseButton: false,
    //showRoadLabels: false,
    //motionTracking: false,
    //motionTrackingControl: false,
    //zoomControl: true,   // Only allow zooming
    //linksControl: false, // Disable links to other street views
    //panControl: false,   // Disable panning
    //clickToGo: false     // Disable moving by clicking
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalBody style={{height: "100%", width: "100%"}}>
          <LoadScript googleMapsApiKey=process.env.REACT_APP_GOOGLE_MAPS_API_KEY>
            <StreetViewPanorama
              onLoad={(panorama) => {
                panorama.setOptions(panoramaOptions);
                panorama.setPosition({lat: lat, lng: lng});
                panorama.setPov({heading: heading, pitch: pitch});
                setStreetView(panorama);
              }}
            />
          </LoadScript>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StreetViewModal;*/