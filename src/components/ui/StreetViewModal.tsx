import React from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";

interface StreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedLink: string;
}

const StreetViewModal: React.FC<StreetViewModalProps> = ({ isOpen, onClose, generatedLink }) => {
  return (
    <div className="flex flex-col gap-2" style={{ height: "50vh", width: "100vw" }}>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" hideCloseButton={true} style={{ height: "100%", width: "100%" }}>
        <ModalContent style={{ height: "70%", width: "100%" }}>
          <ModalBody style={{ height: "100%", width: "100%", padding: 0 }}>
            <iframe
              src={generatedLink}
              style={{ height: "100%", width: "100%", border: "none" }}
              allowFullScreen
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StreetViewModal;
