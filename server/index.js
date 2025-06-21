//predefined modules
require('dotenv').config();
const express=require('express');
const http = require("http");
const cors=require('cors');
const socketIo=require('socket.io');

//user defined modules
const connectToDatabase=require('./database/db');
const socketController = require('./sockets/socketController');

//env variables
const port=process.env.PORT;
const apiKey=process.env.BACKEND_API_KEY;

const corsOptions = {
    origin: "*"
  }

const app=express();
const server = http.createServer(app); 
// const io=(socketIo)(port, { cors: { origin: "*" } });
const io = new socketIo.Server(server, {
    cors: {
      origin: "*"
    },
  });

//cors origin and json parsing 
app.use(cors(corsOptions));
app.use(express.json());

//connection to the database 
connectToDatabase();

//routes
app.use(`/${apiKey}/authentication`,require('./routes/authentication'));
app.use(`/${apiKey}/host`,require('./routes/host'));
app.use(`/${apiKey}/member`,require('./routes/member'));


//Web-socket connection
socketController(io);



server.listen(port,()=>{
    (`server is listening at port ${port}`);
}); 