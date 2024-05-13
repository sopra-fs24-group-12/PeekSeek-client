import React, { useEffect } from"react";
import { useNavigate } from "react-router-dom";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

interface RedirectWithMessageProps {
  message: string;
  redirectTo: string;
  delay?: number;
}

const RedirectWithMessage: React.FC<RedirectWithMessageProps> = ({
  message,
  redirectTo,
  delay = 1500,
}) => {
  const navigate = useNavigate();
  const {isOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(() => {
      // close();
      navigate(redirectTo);
    }, delay);

    return () => {
      clearTimeout(timer);
      close();
    };
  }, [navigate, redirectTo, delay]);

  return (
    <Modal
      isOpen={true}
      placement="center"
      hideCloseButton={true}
      size={"sm"}
    >
      <ModalContent>
        <ModalBody>
          <p className="m-4 text-lg font-semibold text-gray-800">{message}</p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RedirectWithMessage;