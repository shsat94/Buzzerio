const mongoose=require('mongoose');

const mongoUri=process.env.MONGO_URI;

const connectToDatabase=()=>{
    mongoose.connect(mongoUri);
    console.log("Successfully Connected to Database");
}

module.exports=connectToDatabase;