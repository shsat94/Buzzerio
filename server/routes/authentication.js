//imports
const express=require('express');
const router=express.Router();
const User=require('../database/schema/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');


//environment variables
const secretKey=process.env.JWT_AUTHENTICATION_KEY;
const nodemailerEmail=process.env.ADMIN_EMAIL;
const nodemailerPassword=process.env.NODEMAILER_PASSWORD;
const nodemailerPort=process.env.NODEMAILER_PORT;


//signup of the user
router.post('/signup',async(req,res)=>{
    let execution=true;
    try {
        let userisPresent=false;
        let user=await User.findOne({email:req.body.email});
        if(user){
            userisPresent=true;
            return res.status(422).json({userisPresent});
        }

        //password hashing 
        const salt= await bcrypt.genSalt(10);
        const securePassword=await bcrypt.hash(req.body.password,salt);
        user=await User.create({
            name:req.body.name,
            email:req.body.email,
            mobileNo:req.body.mobileNo,
            password:securePassword
        });

        const data={
            user:{
                id:user.id,
                name:user.name
            }
        };
        const authenticationToken=jwt.sign(data,secretKey);
        res.status(200).json({execution,authenticationToken});

    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});


//signin of the user
router.post('/signin',async(req,res)=>{
    let execution=true;
    try {
        let login=false;
        let user=await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).json({login})
        }
        const comparePassword=await bcrypt.compare(req.body.password,user.password);
        if (!comparePassword) {
            return res.status(422).json({login});
        }
        const data={
            user:{
                id:user.id,
                name:user.name
            }
        };
        const authenticationToken=jwt.sign(data,secretKey);
        res.status(200).json({execution,authenticationToken});

    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});



//send otp to email
router.post('/sendotptomail',async(req,res)=>{
    let execution=true;
    try {
        let userisPresent=false;
        let user=await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).json({userisPresent});
        }
        const generatedEmailOtp=Math.floor(100000 + Math.random() * 900000);
        const transporter = nodemailer.createTransport({
            service:'gmail',
            secure: true,
            port:nodemailerPort,
            auth:{
                user:nodemailerEmail,
                pass:nodemailerPassword
            }
        });

        const reciever={
            from: nodemailerEmail,
            to : `${req.body.email}`,
            subject : "Verification for reseting the password of buzzerio",
            text:`OTP to reset your password of buzzerio is ${generatedEmailOtp}` 
        }
        let errorinOTP=false;
        transporter.sendMail(reciever,(error,info)=>{
            if (error) {
                errorinOTP=true;
                res.status(500).json({errorinOTP});
              } else {
                res.status(200).json({generatedEmailOtp});
              }
        });
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});



//reset password
router.put('/resetpassword',async(req,res)=>{
    let execution=true;
    try {
        let updation=false;
        const salt= await bcrypt.genSalt(10);
        const securePass= await bcrypt.hash(req.body.password,salt);

        let user = User.findOne({email:req.body.email});
        let newUser= {
            name: user.name,
            email: req.body.email,
            mobileNo:user.mobileNo,
            password: securePass
        }
        user = await User.findOneAndUpdate({email:req.body.email},{$set:newUser},{new:true});
        updation=true;
        res.status(200).json({updation});
    } catch (error) {
        execution=false;
        res.status(500).json({execution});
    }
});



module.exports=router;