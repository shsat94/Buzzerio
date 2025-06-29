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
        (error);
        res.status(500).json({execution});
    }
});

router.post('/deleteroom',fetchUser,async(req,res)=>{
    let execution=true;
    try {
        
        await Room.deleteOne({hostid:req.user.id,roomId:req.body.roomId});
        const room= await Room.find({hostid:req.user.id});
        res.status(200).json({execution,room});
        
    } catch (error) {
        execution=false;
        (error);
        res.status(500).json({execution});
    }
});
 


router.post('/getroomdetails',async(req,res)=>{
    let execution=true;
    try { 
        const room= await Room.findOne({roomId:req.body.roomId});
        if(!room){
            res.status(404).json({});
            return;
        }
        res.status(200).json({execution,room});
        
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});




module.exports=router;