const express=require('express');
const router=express.Router(); 
const User =require("../database/schema/User");
const fetchUser = require('../middleware/fetchuser');

router.get('/isguest',fetchUser,async(req,res)=>{
    let execution=true;
    try { 
        console.log(req.user.email);
        const user= await User.findOne({email:req.user.email});
        const guest= user.isGuest;
        res.status(200).json({execution,guest});
        
    } catch (error) {
        execution=false;
        console.log(error);
        res.status(500).json({execution});
    }
});

router.delete('/deleteguest',fetchUser,async(req,res)=>{
    let execution=true;
    try { 
        console.log(req.user.email);
        const user= await User.findOneAndDelete({email:req.user.email});
        res.status(200).json({execution,user});
        
    } catch (error) {
        execution=false;
        console.log(error);
        res.status(500).json({execution});
    }
});


module.exports=router;
