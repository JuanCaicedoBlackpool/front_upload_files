import { useState } from "react";

const useErrorHandler = () => {
  const [error, setError] = useState({
    isOpen: false,
    type: "",
    message: "",
  });

  const showError = (errorType, customMessage = "") => {
    setError({
      isOpen: true,
      type: errorType,
      message: customMessage,
    });
  };

  const hideError = () => {
    setError({
      isOpen: false,
      type: "",
      message: "",
    });
  };

  return { error, showError, hideError };
};

export default useErrorHandler;
