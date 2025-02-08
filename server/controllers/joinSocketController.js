const Rooms = require("../database/schema/Rooms");





exports.checkRoomIsPresent=async(roomid,memberName)=>{
    let execution=true;
    try {
        const room=await Rooms.findOne({roomId:roomid});
        if(!room){
            return false;
        }
        room.members.push(memberName);
        return room;

    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
}