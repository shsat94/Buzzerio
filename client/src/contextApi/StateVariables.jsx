import { createContext, useContext, useState } from "react";

const StateVariableContext=createContext();

export const StateVariable=(props)=>{
    const [oneTimePassword,setOneTimePassword]=useState(0);
    const [isUserPresent,setIsUserPresent]=useState(false);
    const [cpRooms, cpSetRooms] = useState([]);
    
    return(
        <StateVariableContext.Provider value={{oneTimePassword,setOneTimePassword,isUserPresent,setIsUserPresent,cpRooms, cpSetRooms}}>
            {props.children}
        </StateVariableContext.Provider>
    )
};

export const useStateVariable = () => useContext(StateVariableContext);