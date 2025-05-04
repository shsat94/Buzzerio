const { saveMemberInRoom } = require("../../controllers/roomController");
const { fetchUserData } = require("../../controllers/userController");


module.exports = (io, socket) => {
    socket.on('join-room', async (roomId, token) => {
        const user = fetchUserData(token);
        const roomIsPresent = await saveMemberInRoom(roomId, user);

        if (!roomIsPresent) {
            socket.emit("not-found");
        } else {
            socket.join(roomId);
            socket.emit("room-joined", roomIsPresent.roomId, user.name);
            io.to(roomId).emit("member-details", roomIsPresent.members);   
        }
    });
};
