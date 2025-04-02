const {  createNewRoom } = require("../../controllers/createSocketController");
const { fetchUserData } = require("../../middleware/fetchUserData");

module.exports = (io, socket) => {
    try {
        socket.on('create-room', async(token) => {
            //data extraction
            const user=fetchUserData(token);
            //new room creation
            const newRoom=await createNewRoom(user);
            
            const roomid=newRoom.roomId;
            const hostname=newRoom.hostname;
            success=true;
            //socket calling
            socket.join(roomid);
            io.to(roomid).emit('creator-room-info',hostname , roomid);
    
        });
        
    } catch (error) {
        io.to(roomid).emit('server-error');
    }
    
    


} 

