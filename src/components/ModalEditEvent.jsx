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
  Select,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Flex,
  HStack,
  Checkbox,
  CheckboxGroup,
  Text,
} from "@chakra-ui/react";

const ModalEditEvent = ({ isOpen, onClose, selectedEvent }) => {
  const [formData, setFormData] = useState({ ...selectedEvent });
  const [isHoveredModalCancel, setIsHoveredModalCancel] = useState(false);
  const [isHoveredEdit, setIsHoveredEdit] = useState(false);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showApplySuccessAlert, setShowApplySuccessAlert] = useState(false);
  const [showApplyErrorAlert, setShowApplyErrorAlert] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [missingField, setMissingField] = useState(false);

  //properly store the edited categories
  const handleCategoryChange = (selectedCategories) => {
    const categoryIds = selectedCategories.map(Number).filter(Boolean);
    setFormData({
      ...formData,
      categoryIds: categoryIds,
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchCategories();

    //properly showcase the date and time in the edit modal
    const parseDateTime = (dateTimeString) => {
      const dateTime = new Date(dateTimeString);
      const date = dateTime.toISOString().split("T")[0];
      const time = dateTime.toTimeString().split(" ")[0];
      return { date, time };
    };

    const { date: startTimeDate, time: startTimeHour } = parseDateTime(
      selectedEvent.startTime
    );
    const { date: endTimeDate, time: endTimeHour } = parseDateTime(
      selectedEvent.endTime
    );

    setFormData({
      ...formData,
      startTimeDate,
      startTimeHour,
      endTimeDate,
      endTimeHour,
    });
  }, []);
  //fetch the users to handle the change in the edit menu
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        console.error("Failed to fetch categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //handle the change of the created by tab, make sure the userId is stored correctly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "createdBy" ? Number(value) : value;
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  //convert the time back to the string it should be saved in
  const formatDateTime = (date, time) => {
    const isoString = `${date}T${time}`;
    const dateTime = new Date(isoString);
    return dateTime.toISOString();
  };

  const handleSubmit = async () => {
    // Check if any required fields are empty
    const requiredFields = [
      "createdBy",
      "title",
      "description",
      "location",
      "startTimeDate",
      "startTimeHour",
      "endTimeDate",
      "endTimeHour",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      // Display error popup if any required fields are empty
      setMissingField(true);
      setTimeout(() => setMissingField(false), 3000);
      return;
    }

    try {
      // Convert date and time to the desired format
      const startTime = formatDateTime(
        formData.startTimeDate,
        formData.startTimeHour
      );
      const endTime = formatDateTime(
        formData.endTimeDate,
        formData.endTimeHour
      );

      const updatedFormData = {
        ...formData,
        startTime,
        endTime,
        categoryIds: formData.categoryIds,
      };

      // Remove unnecessary fields before sending the request
      delete updatedFormData.startTimeDate;
      delete updatedFormData.startTimeHour;
      delete updatedFormData.endTimeDate;
      delete updatedFormData.endTimeHour;

      //update the server with the edited event
      const response = await fetch(
        `http://localhost:3000/events/${updatedFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        console.log("Event updated successfully!");
        setShowApplySuccessAlert(true);
        setTimeout(() => {
          setShowApplySuccessAlert(false);
          onClose(); // Close the modal
          window.location.reload(); // Reload the page
        }, 3000);
      } else {
        console.error("Failed to update event:", response.statusText);
        setShowApplyErrorAlert(true);
        setTimeout(() => setShowApplyErrorAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setShowApplyErrorAlert(true);
      setTimeout(() => setShowApplyErrorAlert(false), 3000);
      console.log(formData.endTimeHour);
    }
  };

  //the actual edit Modal
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="black"
          style={{
            border: "2px solid #C5A63B",
          }}
        >
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Created by</FormLabel>
              <Select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleInputChange}
                color="#DAD4C1"
                bg="black"
                borderColor={invalidFields.includes("createdBy") && "red"}
              >
                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    style={{ color: "#DAD4C1", backgroundColor: "black" }}
                  >
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                borderColor={invalidFields.includes("title") && "red"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                borderColor={invalidFields.includes("description") && "red"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup
                name="categories"
                value={formData.categoryIds}
                onChange={handleCategoryChange}
                isInline
              >
                <HStack align="center" justify="center" spacing={4}>
                  {categories.map((category) => (
                    <Checkbox
                      key={category.id}
                      value={category.id}
                      isChecked={formData.categoryIds.includes(category.id)}
                    >
                      {category.name}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>
            <FormControl>
              <FormLabel>{`Image URL (Optional)`}</FormLabel>
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                borderColor={invalidFields.includes("image") && "red"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                backgroundColor="black"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                borderColor={invalidFields.includes("location") && "red"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                Start Time
                <Flex display="flex" alignItems="center" gap="10px">
                  <Input
                    type="date"
                    name="startTimeDate"
                    value={formData.startTimeDate}
                    onChange={handleInputChange}
                    borderColor={
                      invalidFields.includes("startTimeDate") && "red"
                    }
                  />
                  <Input
                    type="time"
                    name="startTimeHour"
                    value={formData.startTimeHour}
                    onChange={handleInputChange}
                    borderColor={
                      invalidFields.includes("startTimeHour") && "red"
                    }
                  />
                </Flex>
              </FormLabel>
            </FormControl>
            <FormControl>
              <FormLabel>
                End Time
                <Flex display="flex" alignItems="center" gap="10px">
                  <Input
                    type="date"
                    name="endTimeDate"
                    value={formData.endTimeDate}
                    onChange={handleInputChange}
                    borderColor={invalidFields.includes("endTimeDate") && "red"}
                  />
                  <Input
                    type="time"
                    name="endTimeHour"
                    value={formData.endTimeHour}
                    onChange={handleInputChange}
                    borderColor={invalidFields.includes("endTimeHour") && "red"}
                  />
                </Flex>
              </FormLabel>
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent="center" gap="10px">
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredEdit ? "#C5A63B" : "black",
              }}
              onMouseEnter={() => setIsHoveredEdit(true)}
              onMouseLeave={() => setIsHoveredEdit(false)}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
            <Button
              style={{
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                background: isHoveredModalCancel ? "#C5A63B" : "black",
              }}
              onMouseEnter={() => setIsHoveredModalCancel(true)}
              onMouseLeave={() => setIsHoveredModalCancel(false)}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*some Alerts to show whenever a edit action succeeded or failed */}
      {showApplySuccessAlert && (
        <Alert status="success">
          <Text color="black">Event updated successfully!</Text>
        </Alert>
      )}

      {showApplyErrorAlert && (
        <Alert status="error">
          <Text color="black">
            Failed to update event. Please try again later.
          </Text>
        </Alert>
      )}

      {missingField && (
        <Alert status="error">
          <Text color="black">Please fill in all fields.</Text>
        </Alert>
      )}
    </>
  );
};

export default ModalEditEvent;
