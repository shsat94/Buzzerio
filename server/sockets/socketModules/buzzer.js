



module.exports=(io,socket)=>{
    
    socket.on('clicked-time', (roomid,name) => {
        clickedtime=Date.now();
        io.to(roomid).emit('press-info', name, clickedtime);
    });
 
}

