const Room=require('../database/schema/Rooms');


exports.fetchRoom=async(roomId)=>{
    let execution=true;
    try {
        const roomDetail= await Room.findOne({roomId:roomId});
        return roomDetail;        
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
};

exports.addMember=async(memberName,roomId)=>{
    let execution=true;
    try {
        await Room.findOneAndUpdate({roomId:roomId},{$push:{members:memberName}});
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
};