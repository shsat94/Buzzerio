const { saveMemberInRoom } = require("../../controllers/roomController");
const { fetchUserData } = require("../../controllers/userController");


module.exports = (io, socket) => {
    socket.on('join-room', async (roomId, token) => {
        console.log(roomId);
        const user = fetchUserData(token);
        const roomIsPresent = await saveMemberInRoom(roomId, user);
        console.log("found23");
        if (!roomIsPresent) {
            console.log("found67");
            socket.emit("not-found");
        } else {
            console.log("found");
            socket.join(roomId);
            socket.emit("room-joined", roomIsPresent.roomId, user.name);
            io.to(roomId).emit("member-details", roomIsPresent.members);   
        }
    });
};
