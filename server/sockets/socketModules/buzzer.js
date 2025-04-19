
module.exports=(io,socket)=>{  
    
    socket.on('clicked-time', (roomid,name) => {
        clickedtime=Date.now();
        console.log(roomid);
        console.log(clickedtime);
        io.to(roomid).emit('press-info', name, clickedtime);
        console.log("done");
    });

    socket.on('update-host',(timemaplist)=>{
        io.emit('update-host-leader',timemaplist);
    });

    socket.on('reset-leaderboard',(roomid)=>{
        io.to(roomid).emit('reset-leaderboard');
    })
 
}

