import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Header = ({ title }) => {
  return (
    <Box py={2} color="##DAD4C1">
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
    </Box>
  );
};

export default Header;
