import { createContext, useContext, useState } from "react";

const AuthenticationContext=createContext();

export const Authentication=(props)=>{
    const[cpEmail,setCpEmail]=useState("");

    
    return(
        <AuthenticationContext.Provider value={{cpEmail,setCpEmail}}>
            {props.children}
        </AuthenticationContext.Provider>
    )
};

export const useAuthentication = () => useContext(AuthenticationContext);