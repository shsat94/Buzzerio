import { createContext, useState } from "react";


export const UseStateVariableContext=createContext();

export const UseStateVariableState=(props)=>{
    const[errorflag,seterrorflag]=useState(200);
    return(

    <UseStateVariableContext.Provider value={{errorflag,seterrorflag}}>
        {props.children}
    </UseStateVariableContext.Provider>
    )

};