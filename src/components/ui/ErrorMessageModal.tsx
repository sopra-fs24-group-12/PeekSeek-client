import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

interface ErrorMessageModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
}

const ErrorMessageModal: React.FC<ErrorMessageModalProps> = ({ errorMessage, onClose, isOpen }) => {
  // const { isOpen,onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose();
    navigate("/landing");
  };

  return (
    <Modal
      isOpen={isOpen}
      // onOpenChange={onOpenChange}
      onClose={onClose}
      placement="top-center"
      size="sm"
      hideCloseButton={true}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>
          OOPS...
        </ModalHeader>
        <ModalBody>
          <p className="m-4 text-medium font-light text-gray-800">{errorMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleOkClick}
            color="danger"
            radius="full"
            size="sm"


          >
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorMessageModal;