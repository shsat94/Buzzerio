import React from 'react';
import ReactDOM from 'react-dom/client';
import {EnvVariables} from "./context/envVariables.js";
import App from './App';
import { UseStateVariableState } from './context/useStateVariables.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EnvVariables>
    <UseStateVariableState>
    <App />
    </UseStateVariableState>
    </EnvVariables>
  </React.StrictMode>
);

