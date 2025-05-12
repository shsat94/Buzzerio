import { createContext } from "react";
import {io} from 'socket.io-client';



export const EnvVariableContext=createContext();

export const EnvVariables=(props)=>{
    const apiKey = import.meta.env.VITE_API_KEY;
    const host = import.meta.env.VITE_HOST_NAME;
    
    const socket = io(host, {
        transports: ["websocket", "polling"] 
    });
    return(
        <EnvVariableContext.Provider value={{apiKey,host,socket}}>
            {props.children}
        </EnvVariableContext.Provider>
    )
};