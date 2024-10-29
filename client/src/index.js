import React from 'react';
import ReactDOM from 'react-dom/client';
import { EnvVariables } from "./context/envVariables.js";
import App from './App';
import { UseStateVariableState } from './context/useStateVariables.js';
import { ApiCalls } from './context/apiCalls.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiCalls>
      <EnvVariables>
        <UseStateVariableState>
          <App />
        </UseStateVariableState>
      </EnvVariables>
    </ApiCalls>
  </React.StrictMode>
);

