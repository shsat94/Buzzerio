//imports
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
const connectToDatabase=require('./database/db');
//port
const port=process.env.PORT;
const apiKey=process.env.BACKEND_API_KEY;

//cors origin and json parsing 
app.use(cors());
app.use(express.json());

//connection to the database 
connectToDatabase();

//routes
app.use(`/${apiKey}/authentication`,require('./routes/authentication'));
app.use(`/${apiKey}/host`,require('./routes/host'));
// app.use(`/member`,require('./routes/member'));


app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
});