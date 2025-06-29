import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { EnvVariables } from './contextApi/envVariables.jsx';
import { StateVariable } from './contextApi/StateVariables.jsx';
import { LoadingProvider } from './contextApi/Load.jsx';
import { AlertProvider } from './contextApi/Alert.jsx';
import { Authentication } from './contextApi/Authentication.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RoomIdVariable } from './contextApi/Roomid.jsx';
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH}>
    <RoomIdVariable>
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
      </AlertProvider>
    </RoomIdVariable>
  </GoogleOAuthProvider>
)
