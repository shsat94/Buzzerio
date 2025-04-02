import React from 'react';
import ReactDOM from 'react-dom/client';
import { EnvVariables } from "./context/envVariables.js";
import App from './App';
import { UseStateVariableState } from './context/useStateVariables.js';
import { BuzzerioVariables } from './context/buzzerioVariables.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BuzzerioVariables>
      <EnvVariables>
        <UseStateVariableState>
          <App />
        </UseStateVariableState>
      </EnvVariables>
    </BuzzerioVariables>
  </React.StrictMode>
);

