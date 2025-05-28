const buzzer = require("./socketModules/buzzer");
const createRoom = require("./socketModules/createRoom");
const joinRoom = require("./socketModules/joinRoom");

module.exports = (io) => {
    ("websocket is working");
    io.on('connection', socket => {
        //socket for room creation
        createRoom(io, socket);
        //socket for room joining
        joinRoom(io, socket);
        //socket for the buzzer
        buzzer(io,socket);

    });
}; 