import React from "react";
import { useState } from "react";
import ModalDeleteEvent from "./ModalDeleteEvent";
import ModalEditEvent from "./ModalEditEvent";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import Header from "./Header";
import { InfoOutlineIcon, AtSignIcon, CalendarIcon } from "@chakra-ui/icons";
import "./spinner.css";
import { formatTime } from "./FormatTime";

function DetailedEvent({ selectedEvent, createdByUser }) {
  //making so that buttons light up when hovered
  const [isHoveredEdit, setIsHoveredEdit] = useState(false);
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!selectedEvent) {
    return <div>No event selected</div>;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <Box
        width="1000px"
        height="750px"
        border="3px solid #C5A63B"
        borderRadius="xl"
        p="4"
        position="relative"
        backgroundColor="#1C1708"
        margin="20px"
        zIndex="-1"
      >
        {/* Image */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="60%"
          // Check if selectedEvent is defined before accessing its properties
          backgroundImage={`url(${selectedEvent?.image})`}
          opacity="70%"
          backgroundSize="cover"
          backgroundPosition="top"
          backgroundRepeat="no-repeat"
          borderRadius="xl"
        />

        {/* Thin line at the bottom */}
        <Box
          position="absolute"
          bottom="299px"
          left="0"
          right="0"
          height="1.5px"
          backgroundColor="#C5A63B"
        />

        {/* Title */}
        <Box
          position="absolute"
          top="10px"
          left="10px"
          fontWeight="bold"
          zIndex="1"
        >
          <Header style={{ fontStyle: "italic" }} title={selectedEvent.title} />
        </Box>

        {/* info field */}
        <Box
          position="absolute"
          bottom="0"
          left="10px"
          right="0"
          height="290px"
          overflow="auto"
        >
          {/* User who created the event */}
          <Text>Created by:</Text>
          <Box display="flex" alignItems="center" zIndex="1">
            <Image
              src={createdByUser.image}
              borderRadius="full"
              boxSize="50px"
              objectFit="cover"
              alt={createdByUser.name}
            />
            <Text style={{ fontStyle: "italic", marginLeft: "10px" }}>
              {createdByUser.name}
            </Text>
          </Box>

          {/* Description */}
          <Box marginTop="5px">
            <Text style={{ fontStyle: "italic" }}>
              <InfoOutlineIcon marginRight="5px" />
              {selectedEvent.description}
            </Text>
          </Box>

          {/* Location */}
          <Box marginTop="5px">
            <Text>
              {" "}
              <AtSignIcon marginRight="5px" />
              {selectedEvent.location}
            </Text>
          </Box>

          {/* Start date and time */}
          <Box marginTop="5px">
            <Text>
              <CalendarIcon marginRight="5px" />
              Start: {formatTime(selectedEvent.startTime).date}{" "}
              {formatTime(selectedEvent.startTime).time}
            </Text>
          </Box>

          {/* End date and time */}
          <Box marginTop="5px" marginLeft="20px">
            <Text>
              End: {formatTime(selectedEvent.endTime).date}{" "}
              {formatTime(selectedEvent.endTime).time}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box
        position="absolute"
        top="775px"
        left="50%"
        transform="translateX(-50%)"
        textAlign="center"
      >
        {/*Delete modal*/}
        <Button
          style={{
            borderRadius: "4px",
            border: "1px solid #C5A63B",
            background: isHoveredDelete ? "#C5A63B" : "black",
          }}
          onClick={() => setIsDeleteModalOpen(true)}
          onMouseEnter={() => setIsHoveredDelete(true)}
          onMouseLeave={() => setIsHoveredDelete(false)}
        >
          Delete Event
        </Button>

        <ModalDeleteEvent
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          selectedEvent={selectedEvent}
        />
        {/*Edit modal*/}
        <Button
          style={{
            borderRadius: "4px",
            border: "1px solid #C5A63B",
            background: isHoveredEdit ? "#C5A63B" : "black",
          }}
          onClick={() => setIsEditModalOpen(true)}
          onMouseEnter={() => setIsHoveredEdit(true)}
          onMouseLeave={() => setIsHoveredEdit(false)}
          marginLeft="100px"
        >
          Edit Event
        </Button>

        <ModalEditEvent
          isOpen={isEditModalOpen}
          selectedEvent={selectedEvent}
          onClose={() => setIsEditModalOpen(false)}
          onOpen={() => setIsEditModalOpen(true)}
        />
      </Box>
    </Box>
  );
}

export default DetailedEvent;
