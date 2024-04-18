import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ModalDeleteEvent = ({ isOpen, onClose, selectedEvent }) => {
  const [isHoveredModalCancel, setIsHoveredModalCancel] = useState(false);
  const [isHoveredModalDelete, setIsHoveredModalDelete] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const redirectTimer = useState(2); // Countdown timer for redirection
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    if (isDeleted) {
      const timer = setTimeout(() => {
        setIsDeleted(false);
        navigate("/"); // Redirect to the home page
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer); // Cleanup function to clear the timer on unmount or state change
    }
  }, [isDeleted, navigate]);

  const handleDelete = async () => {
    try {
      if (!selectedEvent) {
        console.error("No event selected for deletion.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/events/${selectedEvent.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Event deleted successfully!");
        setIsDeleted(true); // Set the state to show the success alert
        onClose(); // Close the modal after successful deletion
      } else {
        console.error("Failed to delete event:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmationYes = () => {
    setShowConfirmationModal(false);
    handleDelete();
  };

  const handleConfirmationNo = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="Black"
          style={{
            borderRadius: "4px",
            border: "1px solid #C5A63B",
          }}
        >
          <ModalHeader>Delete Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this event? There is no way to get
            the event back.
          </ModalBody>
          <ModalFooter justifyContent="center" gap="10px">
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredModalDelete ? "#C5A63B" : "black",
              }}
              onClick={handleConfirmationModal}
              onMouseEnter={() => setIsHoveredModalDelete(true)}
              onMouseLeave={() => setIsHoveredModalDelete(false)}
            >
              Delete
            </Button>
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredModalCancel ? "#C5A63B" : "black",
              }}
              onClick={onClose}
              onMouseEnter={() => setIsHoveredModalCancel(true)}
              onMouseLeave={() => setIsHoveredModalCancel(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={showConfirmationModal} onClose={handleConfirmationNo}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="Black"
          style={{
            borderRadius: "4px",
            border: "1px solid #C5A63B",
          }}
        >
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter justifyContent="center" gap="10px" marginTop="50px">
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredModalDelete ? "#C5A63B" : "black",
              }}
              onClick={handleConfirmationYes}
              onMouseEnter={() => setIsHoveredModalDelete(true)}
              onMouseLeave={() => setIsHoveredModalDelete(false)}
            >
              Yes
            </Button>
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredModalCancel ? "#C5A63B" : "black",
              }}
              onClick={handleConfirmationNo}
              onMouseEnter={() => setIsHoveredModalCancel(true)}
              onMouseLeave={() => setIsHoveredModalCancel(false)}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isDeleted && (
        <Alert status="success">
          <AlertIcon />
          <Text color="black">
            Event deleted successfully!
            <br />
            Sending you back to the homepage in {redirectTimer} seconds....
          </Text>
        </Alert>
      )}
    </>
  );
};

export default ModalDeleteEvent;
