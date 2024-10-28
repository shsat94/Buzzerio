//predefined modules
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const http=require('http');
const socketIo=require('socket.io');

//user defined modules
const connectToDatabase=require('./database/db');
const roomManupulationSocket = require('./sockets/roomManupulationSocket');
const buzzerLeaderboardManipulation = require('./sockets/buzzerLeaderboardManipulation');

//env variables
const port=process.env.PORT;
const apiKey=process.env.BACKEND_API_KEY;

const app=express();
const socketServer=http.createServer(app);
const io=socketIo(socketServer);

//cors origin and json parsing 
app.use(cors());
app.use(express.json());

//connection to the database 
connectToDatabase();

//routes
app.use(`/${apiKey}/authentication`,require('./routes/authentication'));
app.use(`/${apiKey}/host`,require('./routes/host'));
// app.use(`/member`,require('./routes/member'));


//Web-sockets connection
roomManupulationSocket(io);
// buzzerLeaderboardManipulation(io);



app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
});