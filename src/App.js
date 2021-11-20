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
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Web3 from "web3";
import ErrorMessage from "./components/Errormessage";

import "./stylesheet/App.css";
import Walletimage from "./assets/wallet.svg";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [connectedBalance, setConnectedBalance] = useState(null);
  const [connectedId, setConnectedId] = useState(null);
  const [error, setError] = useState();
  const [state, setState] = useState({
    valNep: "",
    valBusd: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const disconnectWallet = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      await currentProvider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(currentProvider);
      web3.eth.accounts.wallet.clear();
      window.location.reload(true);
    }
    catch { 
      setError(
        "You are still not logged out."
      );
      setInterval(() => {
        setError();
      }, 4000);
    }
  };

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      setError(
        "No Ethereum wallet detected! Please install any available wallet."
      );
      setInterval(() => {
        setError();
      }, 4000);
      return;
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          setError(
            "No Ethereum browser detected! Please install any available wallet."
          );
          setInterval(() => {
            setError();
          }, 4000);
        }
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        let ethBalance = await web3.eth.getBalance(userAccount[0]); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, "ether"); //Convert balance to wei
        if (userAccount.length === 0) {
          console.log("please connect to meta mask");
        } else if (userAccount[0] !== connectedAccount) {
          setIsConnected(true);
          setConnectedAccount(userAccount[0]);
          setConnectedBalance(ethBalance);
          setConnectedId(chainId);
        }
      }
    } catch (err) {
      setError(
        "There was an error connecting to wallet. Please try again later."
      );
      setInterval(() => {
        setError();
      }, 4000);
    }
  };

  function Accountmodal() {
    return (
      <>
        <Modal onClose={onClose} isOpen={isOpen} size={"xl"} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Wallet details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>KEY</Th>
                    <Th isNumeric>VALUE</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Account</Td>
                    <Td isNumeric> {connectedAccount}</Td>
                  </Tr>
                  <Tr>
                    <Td>ChainID</Td>
                    <Td isNumeric> {connectedId}</Td>
                  </Tr>
                  <Tr>
                    <Td>Balance</Td>
                    <Td isNumeric> {connectedBalance}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </ModalBody>
            <Box p={5}>
              <Button
                onClick={disconnectWallet}
                colorScheme="red" size="md"
                width="100%"
              >
                Disconnect
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      </>
    );
  }

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
                <Button onClick={onOpen} colorScheme="green" variant="link">
                  <img src={Walletimage} alt="Wallet icon" />
                  <span>&nbsp;Check Wallet Details</span>
                </Button>
              </Box>
            )}
          </div>
        </div>
      </div>
      <ErrorMessage message={error} />
      <Accountmodal />
    </>
  );
}

export default App;
