const { fetchRoom, addMember } = require("../controllers/socketController");

module.exports=(io)=>{
    io.on('connection',(socket)=>{
        console.log('User is connected');
        

        socket.on('host-join-room',(roomId)=>{
            const roomDetail=fetchRoom(roomId);
            io.to(roomId).emit('creator-room-info', roomDetail);
        });
        
        socket.on('member-join-room',(roomId,name)=>{
            const roomDetail=fetchRoom(roomId);
            if(!roomDetail){
                socket.emit('invalid-room');
            }
            else{
                addMember(roomId,name);
                io.to(roomId).emit('room-details',name);
            }
        });
        socket.on('disconnect',()=>{
            console.log('A user is disconnected');
        });
    });
};