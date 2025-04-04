import { createContext, useState } from "react";


export const UseStateVariableContext=createContext();

export const UseStateVariableState=(props)=>{
    const[errorflag,seterrorflag]=useState(200);
    const [isdisable,setisdisable]=useState(false);
    const [ROOMID,setROOMID]=useState("");
    const [NAME,setNAME]=useState("");
    const [timeMappingList, setTimeMappingList] = useState([]);


    return(
    <UseStateVariableContext.Provider value={{errorflag,seterrorflag,isdisable,setisdisable,ROOMID,setROOMID,NAME,setNAME,timeMappingList,setTimeMappingList}}>
        {props.children}
    </UseStateVariableContext.Provider>
    )

};