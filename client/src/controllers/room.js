import { useContext } from "react";
import { EnvVariableContext } from "../context/envVariables";
import { UseStateVariableContext } from "../context/useStateVariables";

export const useRoomActions = () => {
    const { apiKey, host, socket } = useContext(EnvVariableContext) || {};
    const { seterrorflag } = useContext(UseStateVariableContext) || {};
    

    const createRoom = () => {

        try {
            socket.emit("create-room", localStorage.getItem("token"));

        } catch (error) {
            seterrorflag(500);

        }
    };

    const fetchAllRoom = async () => {
        try {
            const res = await fetch(`${host}/${apiKey}/host/getallrooms`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const response = await res.json();
            return response;
        } catch (error) {
            seterrorflag(500);
        }
    };

    const getRoomDetails = async (roomId) => {
        try {
            const res = await fetch(`${host}/${apiKey}/host/getroomdetails?roomId=${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const response = await res.json();
            return response;
        } catch (error) {
            seterrorflag(500);
        }
    };

    return { createRoom, fetchAllRoom, getRoomDetails };
};
