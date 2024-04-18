import React from "react";
import "./spinner.css";
import { formatTime } from "./FormatTime";
import Header from "./Header";
import { Box, Text } from "@chakra-ui/react";
import { CalendarIcon, InfoOutlineIcon, AtSignIcon } from "@chakra-ui/icons";

//1 eventbox, data is getting pulled in from the overview page
function EventBox({ eventData }) {
  if (!eventData) {
    return null;
  }

  const events = Array.isArray(eventData) ? eventData : [eventData];

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {events &&
              events.map((event) => (
                <Box
                  key={event.id}
                  width="400px"
                  height="300px"
                  border="3px solid #C5A63B"
                  borderRadius="xl"
                  p="4"
                  position="relative"
                  backgroundColor="#1C1708"
                  margin="20px"
                  z-index="-1"
                >
                  {/* Image */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    height="60%"
                    backgroundImage={`url(${event.image})`}
                    opacity="70%"
                    backgroundSize="cover"
                    backgroundPosition="top"
                    backgroundRepeat="no-repeat"
                    borderRadius="xl"
                  />

                  {/* Thin line at the bottom */}
                  <Box
                    position="absolute"
                    bottom="117px"
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
                    fontSize="1.5rem"
                    fontWeight="bold"
                    zIndex="1"
                  >
                    <Header
                      style={{ fontStyle: "italic" }}
                      title={event.title}
                    />
                  </Box>

                  {/* Text */}
                  <Box
                    position="absolute"
                    bottom="0"
                    left="10px"
                    right="0"
                    height="110px"
                    overflow="auto"
                  >
                    <Text style={{ fontStyle: "italic" }}>
                      <InfoOutlineIcon marginRight="5px" />
                      {event.description}
                    </Text>

                    <Text>
                      {" "}
                      <AtSignIcon marginRight="5px" />
                      {event.location}
                    </Text>
                    <Text>
                      <CalendarIcon marginRight="5px" />
                      Start: {formatTime(event.startTime).date}{" "}
                      {formatTime(event.startTime).time}
                    </Text>
                    <Text marginLeft="20px">
                      End: {formatTime(event.endTime).date}{" "}
                      {formatTime(event.endTime).time}
                    </Text>
                  </Box>
                </Box>
              ))}
          </Box>
        </div>
      ))}
    </div>
  );
}

export default EventBox;
