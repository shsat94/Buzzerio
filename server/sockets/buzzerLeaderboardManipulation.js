module.exports=(io)=>{
    io.on('connection',(socket)=>{
        console.log('User is connected');
        
    
    
    
        socket.on('disconnect',()=>{
            console.log('A user is disconnected');
        });
    });
}