const { leaveRoom, checkRoomIsPresent } = require("../../controllers/roomController");
const { fetchUserData } = require("../../controllers/userController");

module.exports = (io, socket) => {  
    socket.on('clicked-time', (roomid, name) => {
        clickedtime = Date.now();
        io.to(roomid).emit('press-info', name, clickedtime);
    });

    socket.on('update-host', (timemaplist) => {
        io.emit('update-host-leader', timemaplist);
    });

    socket.on('reset-leaderboard', (roomid) => {
        io.to(roomid).emit('reset-leaderboard');
    });

    socket.on('leave-room', async (token, roomid) => {
        const user = fetchUserData(token);
        socket.leave(roomid);
        await leaveRoom(roomid, user);
        const room = checkRoomIsPresent(roomid);
        io.to(roomid).emit("member-details", room.members);   
    });
};
