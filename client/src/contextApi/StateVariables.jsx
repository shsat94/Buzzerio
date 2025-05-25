import { createContext, useContext, useState } from "react";

const StateVariableContext=createContext();

export const StateVariable=(props)=>{
    const [oneTimePassword,setOneTimePassword]=useState(0);
    const [isUserPresent,setIsUserPresent]=useState(false);
    const [cpRooms, cpSetRooms] = useState([]);
    const [cpRoomId,setCpRoomId]=useState("");
    const [cpName,setCpName]=useState("");
    
    return(
        <StateVariableContext.Provider value={{oneTimePassword,setOneTimePassword,isUserPresent,setIsUserPresent,cpRooms, cpSetRooms,cpRoomId,setCpRoomId,cpName,setCpName}}>
            {props.children}
        </StateVariableContext.Provider>
    )
};

export const useStateVariable = () => useContext(StateVariableContext);