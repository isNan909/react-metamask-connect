import { useState } from "react";
import {
  Heading,
  Flex,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Box,
} from "@chakra-ui/react";
import ErrorMessage from "./components/Errormessage";

import "./stylesheet/App.css";
import Walletimage from "./assets/wallet.svg";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState();
  const [state, setState] = useState({
    valNep: "",
    valBusd: "",
  });

  // const loggedIn = () => {
  //   setIsConnected(true);
  // };

  // const loggedOut = () => {
  //   setIsConnected(false);
  // };

  const onConnect = () => {
    try {
      if (!window.ethereum) {
        setError("No crypto wallet found. Please install it.");
        setInterval(() => {
          setError();
        }, 4000);
      }
      // add connection with web3 here
      console.log("commect with web3");
    } catch (err) {
      setError(
        "There was an error connecting to wallet. Please try again later."
      );
      setInterval(() => {
        setError();
      }, 4000);
    }
  };

  function handleChange(evt) {
    const value = evt.target.value;
    const name = evt.target.name;
    if (name === "nep") {
      setState({
        valBusd: (value * 3).toFixed(2),
        valNep: value,
      });
    } else if (name === "busd") {
      setState({
        valNep: (value / 3).toFixed(2),
        valBusd: value,
      });
    } else {
      setState({
        valNep: "",
        valBusd: "",
      });
    }
  }

  return (
    <>
      <div className="App">
        <div className="App_wrapper">
          <div className="App_box">
            <Heading as="h1" size="lg" mb="35">
              Crypto Converter
            </Heading>
            <Flex justifyContent="flex-start">
              <FormControl id="amount" mr={5}>
                <FormLabel>NEP</FormLabel>
                <NumberInput value={state.valNep}>
                  <NumberInputField name="nep" onChange={handleChange} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl id="amount" ml={5}>
                <FormLabel>BUSD</FormLabel>
                <NumberInput value={state.valBusd}>
                  <NumberInputField name="busd" onChange={handleChange} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Flex>
            {!isConnected && (
              <Alert status="warning" mt="25">
                <AlertIcon />
                You have not connected your wallet.
                <Button
                  onClick={onConnect}
                  colorScheme="blue"
                  variant="link"
                  ml={1}
                >
                  <u>Connect Now</u>
                </Button>
              </Alert>
            )}
            {isConnected && (
              <Box mt="25">
                <Button colorScheme="green" variant="link">
                  <img src={Walletimage} alt="Wallet icon" />
                  <span>&nbsp;Check Wallet Details</span>
                </Button>
              </Box>
            )}
          </div>
        </div>
      </div>
      <ErrorMessage message={error} />
    </>
  );
}

export default App;
