import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Alert,
  AlertIcon,
  Text,
  Checkbox,
  CheckboxGroup,
  HStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export function AddEventModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredModalApply, setIsHoveredModalApply] = useState(false);
  const [isHoveredModal, setIsHoveredModal] = useState(false);
  const [isHoveredModalReset, setIsHoveredModalReset] = useState(false);
  //setting empty string for form data
  const [formData, setFormData] = useState({
    createdBy: null,
    title: "",
    description: "",
    image: "",
    location: "",
    startTimeDate: "",
    startTimeHour: "",
    endTimeDate: "",
    endTimeHour: "",
    categoryIds: [],
  });
  const [maxId, setMaxId] = useState(0);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [invalidFields, setInvalidFields] = useState([]);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [showApplySuccessAlert, setShowApplySuccessAlert] = useState(false);
  const [showApplyErrorAlert, setShowApplyErrorAlert] = useState(false);

  useEffect(() => {
    fetchMaxId();
    fetchUsers();
    fetchCategories();
  }, []);
  //get event data from server
  const fetchMaxId = async () => {
    try {
      const response = await fetch("http://localhost:3000/events");
      if (response.ok) {
        const data = await response.json();
        setMaxId(data.maxId);
      } else {
        console.error("Failed to fetch max ID:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //get userdata from server
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
  //get category data from server
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
  //check input created by and concert to a value (without "")
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "createdBy" ? parseInt(value) : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };
  //convert time to correct timestamp
  const convertToTimestamp = (date, hour) => {
    return `${date}T${hour}`;
  };
  //handle the submit data filled in in the forum
  const handleSubmit = async () => {
    let invalid = false;
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
    const invalidFields = [];
    //check if all fields are filled in
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        invalid = true;
        invalidFields.push(field);
      }
    });

    // Check if at least one category is selected
    if (formData.categories.length === 0) {
      invalid = true;
      invalidFields.push("categories");
    }
    //if there are empty fields push a popup error
    if (invalid) {
      setInvalidFields(invalidFields);
      setShowApplyErrorAlert(true);
      setTimeout(() => setShowApplyErrorAlert(false), 3000);
      return;
    }
    //convert the starttime and endtime
    const startTime = convertToTimestamp(
      formData.startTimeDate,
      formData.startTimeHour
    );
    const endTime = convertToTimestamp(
      formData.endTimeDate,
      formData.endTimeHour
    );
    //create a new event and push the data to the server
    const response = await fetch("http://localhost:3000/events");
    const data = await response.json();
    const newEvent = {
      id: data.length + 1,
      createdBy: formData.createdBy,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      location: formData.location,
      startTime: startTime,
      endTime: endTime,
      categoryIds: formData.categoryIds,
    };
    //fetch all the events (including the new one) from the server to display whenever modal closes
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      //if the response is okay add an message, if there is an error also display a message
      if (response.ok) {
        console.log("Event added successfully!");
        setMaxId(maxId + 1);
        setShowApplySuccessAlert(true);
        setTimeout(() => setShowApplySuccessAlert(false), 3000);
        window.location.reload();
      } else {
        console.error("Failed to add event:", response.statusText);
        setShowApplyErrorAlert(true);
        setTimeout(() => setShowApplyErrorAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setShowApplyErrorAlert(true);
      setTimeout(() => setShowApplyErrorAlert(false), 3000);
    }
    // If you press reset button forumdata will be emptied again
    setFormData({
      createdBy: "",
      title: "",
      description: "",
      image: "",
      location: "",
      startTimeDate: "",
      startTimeHour: "",
      endTimeDate: "",
      endTimeHour: "",
      categories: [],
      categoryIds: [],
    });

    //if you press close button the modal closes
    onClose();
  };

  //apply correct way to store categories
  const handleCategoryChange = (selectedCategories) => {
    setFormData({
      ...formData,
      categories: selectedCategories,
      categoryIds: selectedCategories.map(Number).filter(Boolean),
    });
  };

  //The actual page with styling
  return (
    <>
      <Button
        onClick={onOpen}
        style={{
          marginLeft: "10px",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #C5A63B",
          width: "120px",
          maxWidth: "100%",
          color: "#DAD4C1",
          background: isHovered ? "#C5A63B" : "black",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AddIcon /> Add event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="black"
          style={{
            border: "2px solid #C5A63B",
          }}
        >
          <ModalHeader>Create an event</ModalHeader>
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
                <option
                  value=""
                  disabled
                  style={{ backgroundColor: "black", color: "#DAD4C1" }}
                >
                  Select User
                </option>
                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    style={{
                      color: "#DAD4C1",
                      backgroundColor: "black",
                    }}
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
                marginTop: "30px",
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                width: "120px",
                maxWidth: "100%",
                color: "#DAD4C1",
                background: isHoveredModalReset ? "#C5A63B" : "black",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={() => setIsHoveredModalReset(true)}
              onMouseLeave={() => setIsHoveredModalReset(false)}
              onClick={() => {
                setFormData({
                  createdBy: "",
                  title: "",
                  description: "",
                  image: "",
                  location: "",
                  startTimeDate: "",
                  startTimeHour: "",
                  endTimeDate: "",
                  endTimeHour: "",
                  categories: [],
                  categoryIds: [],
                });
                setShowResetAlert(true);
                setTimeout(() => setShowResetAlert(false), 3000);
              }}
            >
              Reset
            </Button>
            <Button
              style={{
                marginTop: "30px",
                marginLeft: "10px",
                content: "center",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                width: "120px",
                maxWidth: "100%",
                color: "#DAD4C1",
                background: isHoveredModalApply ? "#C5A63B" : "black",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={() => setIsHoveredModalApply(true)}
              onMouseLeave={() => setIsHoveredModalApply(false)}
              onClick={handleSubmit}
            >
              Apply
            </Button>
            <Button
              onClick={onClose}
              style={{
                marginTop: "30px",
                marginLeft: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #C5A63B",
                width: "120px",
                maxWidth: "100%",
                color: "#DAD4C1",
                background: isHoveredModal ? "#C5A63B" : "black",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={() => setIsHoveredModal(true)}
              onMouseLeave={() => setIsHoveredModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {showResetAlert && (
        <Alert
          status="info"
          style={{
            color: "black",
            position: "fixed",
            maxWidth: "300px",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          onClose={() => setShowResetAlert(false)}
        >
          <AlertIcon />
          <Text>Event reset successfully!</Text>
        </Alert>
      )}
      {/*Alert message to show succesfully created new event */}
      {showApplySuccessAlert && (
        <Alert
          status="success"
          style={{
            color: "black",
            position: "fixed",
            maxWidth: "300px",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          onClose={() => setShowApplySuccessAlert(false)}
        >
          <AlertIcon />
          <Text>Successfully added a new event!</Text>
        </Alert>
      )}

      {/*Alert message to show error of empty fields */}
      {showApplyErrorAlert && (
        <Alert
          status="error"
          style={{
            color: "black",
            position: "fixed",
            maxWidth: "300px",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          onClose={() => setShowApplyErrorAlert(false)}
        >
          <AlertIcon />
          <Text>Please fill in all fields.</Text>
        </Alert>
      )}
    </>
  );
}
