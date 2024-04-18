import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

//Link to the 'homepage'. This page is always accessible
export const Navigation = () => {
  return (
    <Flex
      marginTop="20px"
      p={4}
      color="white"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
    >
      <Text
        fontSize="30px"
        fontFamily="Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif"
        color="#DAD4C1"
      >
        <Link to="/">Planned Events</Link>
      </Text>
    </Flex>
  );
};
