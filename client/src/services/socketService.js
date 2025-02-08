import io from 'socket.io-client';


let socket;
const host=process.env.REACT_APP_HOST_NAME;

export const initiateConnection=()=>{
    socket=io(host);
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
 