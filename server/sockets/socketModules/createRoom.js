const { createNewRoom,getHostNameByRoomId, checkRoomIsPresent } = require("../../controllers/roomController");
const { fetchUserData } = require("../../controllers/userController");


module.exports = (io, socket) => {
    socket.on('create-room', async (token) => {
        try {
            const user = await fetchUserData(token);
            const newRoom = await createNewRoom(user);

            const roomid = newRoom.roomId;
            const hostname = newRoom.hostname;

            socket.join(roomid);
            io.to(roomid).emit('creator-room-info', hostname, roomid);

        } catch (error) {
            io.to(socket.id).emit('server-error');
        }
    });

    socket.on('host-rejoin-room', async(roomId) => {
        socket.join(roomId);
        const hostName =await getHostNameByRoomId(roomId); 
        (roomId);

        socket.emit("creator-room-info", hostName, roomId);
        const room=await checkRoomIsPresent(roomId);
        (room);
        io.to(roomId).emit("member-details", room.members);
    })
};
