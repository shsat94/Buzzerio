const {  createNewRoom } = require("../../controllers/createSocketController");
const { fetchUserData } = require("../../middleware/fetchUserData");

module.exports = (io, socket) => {

    socket.on('create-room', (token) => {
        //data extraction
        const user=fetchUserData(token);
        //new room creation
        const newRoom=createNewRoom(user);
        const roomid=newRoom.roomId;
        const hostname=newRoom.hostname;
        //socket calling
        socket.join(roomid);
        io.to(roomid).emit('creator-room-info',hostname , roomid);

    });


}

