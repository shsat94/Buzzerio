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
            members:[]
        });
        res.status(200).json({execution,room});
        
    } catch (error) {
        execution=false;
        console.log(error);
        res.status(500).json({execution});
    }
});


router.get('/getallrooms',fetchUser,async(req,res)=>{
    let execution=true;
    try {
        
        const room= await Room.find({hostid:req.user.id});
        res.status(200).json({execution,room});
        
    } catch (error) {
        execution=false;
        console.log(error);
        res.status(500).json({execution});
    }
});
 


router.get('/getroomdetails',fetchUser,async(req,res)=>{
    let execution=true;
    try { 
        const room= await Room.findOne({roomId:req.body.roomId});
        res.status(200).json({execution,room});
        
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});




module.exports=router;