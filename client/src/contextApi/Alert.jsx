import { createContext, useState, useContext } from 'react';
import AlertPopup from '../component/AlertPopup';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [message, setMessage] = useState("");
  const [actionButton, setActionButton] = useState(() => {});
  const [buttonText, setButtonText] = useState("OK");

  const PopAlert = (popType, msg, actions, text) => {
    if (showAlert) return;
    
    setAlertType(popType);
    setMessage(msg);
    setButtonText(text || "OK");
    setActionButton(() => (closeType) => {
      if (closeType === 'close_button' || closeType === 'close_outside') {
        setShowAlert(false);
        return;
      }
      if (typeof actions === 'function') {
        actions();
      }
      setShowAlert(false);
    });
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <AlertContext.Provider value={{ PopAlert, closeAlert }}>
      {showAlert && 
        <AlertPopup 
          type={alertType}
          message={message}
          onAction={actionButton}
          buttonText={buttonText}
        />
      }
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);