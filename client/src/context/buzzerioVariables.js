import { createContext} from "react";


export const BuzzerioVariableContext=createContext();

export const BuzzerioVariables=(props)=>{
    const roomId="";
    
    return(
        <BuzzerioVariableContext.Provider value={{roomId}}>
            {props.children}
        </BuzzerioVariableContext.Provider>
    )
};