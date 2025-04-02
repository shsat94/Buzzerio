const { checkRoomIsPresent } = require("../../controllers/joinSocketController");
const { fetchUserData } = require("../../middleware/fetchUserData");



module.exports = (io, socket) => {

    socket.on('join-room', async (roomId, token) => {

        //user info fetching
        const user = fetchUserData(token);

        //presence of room is checked
        const roomIsPresent = await checkRoomIsPresent(roomId, user.name);
        

        // socket emission
        if (!roomIsPresent) {
            socket.emit("not-found");
        } else {
            socket.join(roomId);
            socket.emit("room-joined",roomIsPresent.roomId,user.name);
            io.to(roomId).emit("member-details", roomIsPresent.members);   
        }
        
    });


}

