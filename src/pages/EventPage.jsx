import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DetailedEvent from "../components/DetailedEvent";

const EventPage = () => {
  const { id } = useParams();

  const [eventData, setEventData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createdByUser, setCreatedByUser] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const eventData = await response.json();
        setEventData(eventData);
      } catch (error) {
        setError(error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        setError(error);
      }
    };

    fetchEventData();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (eventData && id) {
      const event = eventData.find((event) => event.id === parseInt(id));
      setSelectedEvent(event);
    }
  }, [eventData, id]);

  useEffect(() => {
    if (selectedEvent && userData) {
      const createdByUser = userData.find(
        (user) => user.id === selectedEvent.createdBy
      );
      setCreatedByUser(createdByUser);
      setLoading(false);
    }
  }, [selectedEvent, userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!selectedEvent) {
    return <div>Event not found</div>;
  }

  return (
    <DetailedEvent
      selectedEvent={selectedEvent}
      createdByUser={createdByUser}
    />
  );
};

export default EventPage;
