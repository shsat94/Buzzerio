import { createContext, useContext, useState } from "react";

const roomIdContext=createContext();

export const RoomIdVariable=(props)=>{
    const[searchRoomid,setSearchRoomId]=useState("");
    const[joinRoomAsGuest,setJoinRoomAsGuest]=useState(false);
    const[searchUrl,setSearchUrl]=useState('');
    
    return(
        <roomIdContext.Provider value={{searchRoomid,setSearchRoomId,joinRoomAsGuest,setJoinRoomAsGuest,searchUrl,setSearchUrl}}>
            {props.children}
        </roomIdContext.Provider>
    )
};

export const useSearchRoomId = () => useContext(roomIdContext);