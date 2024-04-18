import { extendTheme } from "@chakra-ui/react";
import backgroundImage from "./Images/background.png";

const globalStyle = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "black",
        backgroundImage: `url(${backgroundImage}) !important`,
        backgroundSize: "cover",
        zindex: "-1",
        backgroundRepeat: "no-repeat",
        color: "#DAD4C1",
      },
      // Add custom class to apply custom styles
      ".custom-global-class": {
        // Define your custom styles here
      },
    },
  },
  fonts: {
    body: "Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif",
    heading: "Montserrat, sans-serif",
  },
});

export default globalStyle;
