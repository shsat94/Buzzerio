import { createContext, useContext, useState } from "react";

const roomIdContext=createContext();

export const RoomIdVariable=(props)=>{
    const[searchRoomid,setSearchRoomId]=useState("");
    const[joinRoomAsGuest,setJoinRoomAsGuest]=useState(false);
    
    return(
        <roomIdContext.Provider value={{searchRoomid,setSearchRoomId,joinRoomAsGuest,setJoinRoomAsGuest}}>
            {props.children}
        </roomIdContext.Provider>
    )
};

export const useSearchRoomId = () => useContext(roomIdContext);