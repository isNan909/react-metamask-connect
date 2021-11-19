import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import "../stylesheet/Error.css";

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-box">
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

export default ErrorMessage;
