const express=require('express');
const router=express.Router();
const fetchUser = require('../middleware/fetchuser');
const Room=require('../database/schema/Rooms');

const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

router.post('/createroom',fetchUser,async(req,res)=>{
    let execution=true;
    try {
        const roomid=generateRoomId();
        const room=await Room.create({
            hostid:req.user.id,
            hostname:req.user.name,
            roomId:roomid,
            validDate:req.body.validDate,
            members:[]
        });
        res.status(200).json({room});
        
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});





module.exports=router;