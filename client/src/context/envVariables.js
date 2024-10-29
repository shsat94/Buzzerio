import { createContext } from "react";


export const EnvVariableContext=createContext();

export const EnvVariables=(props)=>{
    const apiKey=process.env.REACT_APP_API_KEY;
    const host=process.env.REACT_APP_HOST_NAME;
    return(
        <EnvVariableContext.Provider value={{apiKey,host}}>
            {props.children}
        </EnvVariableContext.Provider>
    )
};


