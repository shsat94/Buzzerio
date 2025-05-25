import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { EnvVariables } from './contextApi/envVariables.jsx';
import { StateVariable } from './contextApi/StateVariables.jsx';
import { LoadingProvider } from './contextApi/Load.jsx';
import { AlertProvider } from './contextApi/Alert.jsx';
import { Authentication } from './contextApi/Authentication.jsx';

createRoot(document.getElementById('root')).render(

  <AlertProvider>
    <Authentication>
      <LoadingProvider>
        <StateVariable>
          <EnvVariables>
            <App />
          </EnvVariables>
        </StateVariable>
      </LoadingProvider>
    </Authentication>
  </AlertProvider>,
)
