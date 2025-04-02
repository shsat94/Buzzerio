const express=require('express');
const router=express.Router(); 
const fetchUser = require('../middleware/fetchuser');
const Room=require('../database/schema/Rooms');


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