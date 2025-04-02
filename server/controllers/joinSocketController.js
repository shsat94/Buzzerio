const Rooms = require("../database/schema/Rooms");


exports.checkRoomIsPresent=async(roomid,memberName)=>{
    let execution=true;
    try {
        const room=await Rooms.findOne({roomId:roomid});
        if(!room){
            return false;
        }
        room.members.push(memberName);
        const savedroom=await Rooms.findOneAndUpdate({roomId:roomid},{ $set: room }, { new: true })
        return savedroom;

    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
}