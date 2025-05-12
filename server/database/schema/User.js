const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true 
    },
    noOfRooms:{
        type:Number,
        default:2
    },
    date:{
        type:String,
        default:Date.now 
    }
});

module.exports= mongoose.model('user',userSchema);