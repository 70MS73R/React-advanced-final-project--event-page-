import React, { useEffect, useState } from "react";
import { Box, Alert, AlertIcon, Select, Input } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import EventBox from "../components/Eventbox";
import Spinner from "../components/Spinner";

import { AddEventModal } from "../components/AddEvent";

export const EventsListPage = () => {
  const [eventData, setEventData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch event data
        const eventResponse = await fetch(`http://localhost:3000/events`);
        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event data");
        }
        const eventData = await eventResponse.json();
        setEventData(eventData);

        // Fetch user data
        const userResponse = await fetch("http://localhost:3000/users");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch category data
        const categoryResponse = await fetch(
          "http://localhost:3000/categories"
        );
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category data");
        }
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to filter events based on category
  const filterEventsByCategory = () => {
    if (!selectedCategory) {
      return eventData; // Return all events if no category selected
    } else {
      return eventData.filter((event) =>
        event.categoryIds.includes(Number(selectedCategory))
      );
    }
  };

  // Function to filter events based on search query
  const filterEventsByName = () => {
    if (!searchQuery) {
      return eventData; // Return all events if search query is empty
    } else {
      return eventData.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box>
      <Box
        maxWidth="1000px"
        width="80%"
        margin="auto"
        display="flex"
        alignItems="center"
        justifyContent="center" // Center the items horizontally
      >
        {/* UI to select categories */}
        <Select
          maxWidth="150px"
          color="#DAD4C1" // Set the text color of the select input to #DAD4C1
          background="black" // Set the background color of the select input to black
          value={selectedCategory}
          onChange={handleCategoryChange}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "black", // Set background color of control (select input)
              borderColor: "#C5A63B", // Set border color
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "#DAD4C1", // Set text color of selected value
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? "blue" : "black", // Change background color of selected/unselected options
              color: "#DAD4C1", // Set text color of options to #DAD4C1
            }),
          }}
          style={{ marginTop: 0, borderColor: "#C5A63B" }} // Adjust marginTop and set border color
        >
          <option value="" hidden>
            Category
          </option>
          <option
            value=""
            style={{ backgroundColor: "black", color: "#DAD4C1" }}
          >
            All Events
          </option>{" "}
          {/* Set background and text color for "All Events" option */}
          {categoryData &&
            categoryData.map((category) => (
              <option
                key={category.id}
                value={category.id}
                style={{ backgroundColor: "black", color: "#DAD4C1" }} // Set background and text color of individual option
              >
                {category.name}
              </option>
            ))}
        </Select>

        {/* Filter input field */}
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by event name"
          marginLeft="10px"
          padding="8px"
          borderRadius="4px"
          border="1px solid #C5A63B" // Set border color
          width="250px"
          maxWidth="100%"
          color="#DAD4C1" // Set text color to #DAD4C1
          background="black" // Set background color to black
          _placeholder={{ color: "#DAD4C1" }} // Set placeholder text color to #DAD4C1
        />

        {/* Add event button */}
        <AddEventModal />
      </Box>

      {/* Display filtered events */}
      {isLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Spinner />
        </Box>
      ) : (
        <div
          style={{
            maxWidth: "1400px",
            width: "80%",
            margin: "30px auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: "5px",
          }}
        >
          {(eventData ? filterEventsByCategory() : [])
            .filter((event) =>
              event.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((event) => (
              <ChakraLink
                as={ReactRouterLink}
                key={event.id}
                to={`/events/${event.id}`}
                onClick={() => console.log("Clicked event ID:", event.id)}
              >
                <EventBox eventData={event} />
              </ChakraLink>
            ))}
        </div>
      )}
    </Box>
  );
};
