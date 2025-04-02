import { createContext } from "react";
import {io} from 'socket.io-client';


export const EnvVariableContext=createContext();

export const EnvVariables=(props)=>{
    const apiKey=process.env.REACT_APP_API_KEY;
    const host=process.env.REACT_APP_HOST_NAME;
    const socket = io(host, {
        transports: ["websocket", "polling"] 
    });
    return(
        <EnvVariableContext.Provider value={{apiKey,host,socket}}>
            {props.children}
        </EnvVariableContext.Provider>
    )
};


