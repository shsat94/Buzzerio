const { checkRoomIsPresent } = require("../../controllers/joinSocketController");
const { fetchUserData } = require("../../middleware/fetchUserData");



module.exports=(io,socket)=>{

    socket.on('join-room', (roomId,token) => {
        //user info fetching
        const user=fetchUserData(token);
        //presence of room is checked
        const roomIsPresent=checkRoomIsPresent(roomId,user.name);
        // socket emission
        !roomIsPresent? socket.emit("not-found"): io.to(roomId).emit('room-details', roomIsPresent.hostname);
    });
    
}

