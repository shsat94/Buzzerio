const Rooms = require('../database/schema/Rooms');


const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!~';
    let result = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

exports.createNewRoom=async(user)=>{
    let execution=true;
    try {
        let roomid=generateRoomId();

        const room=await Rooms.create({
            hostid:user.id,
            hostname:user.name,
            roomId:roomid 
        });
        return room;  
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
}