//imports
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
const connectToDatabase=require('./database/db');
//port
const port=process.env.PORT;

//cors origin and json parsing 
app.use(cors());
app.use(express.json());

//connection to the database 
connectToDatabase();

//routes
app.use('/authentication',require('./routes/authentication'));
app.use('/rooms',require('./routes/rooms'));

app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
});