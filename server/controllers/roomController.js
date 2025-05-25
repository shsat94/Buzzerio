const Rooms = require("../database/schema/Rooms");

const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*!~';
    let result = '';

    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

exports.leaveRoom = async (roomid, user) => {
    try {
        const room = await Rooms.findOne({ roomId: roomid });
        if (!room) {
            return { execution: false, message: 'Room not found' };
        }
        room.members = room.members.filter(member => member.id != user.id);
        if (room.members.length === 0) {
            room.members = [];
        }
        const savedroom = await room.save();
        if (!savedroom) {
            return { execution: false, message: 'Failed to update room members' };
        }
        return { execution: true, room: savedroom };
    } catch (error) {
        console.error(error);
        return { execution: false, message: error.message };
    }
};



exports.checkRoomIsPresent = async (roomid) => {
    try {
        const room = await Rooms.findOne({ roomId: roomid });
        console.log(room);
        if (!room) {
            return false;
        }
        return room;
    } catch (error) {
        throw error;
    }
};

exports.saveMemberInRoom = async (roomid, user) => {
    try {
        const room = await Rooms.findOne({ roomId: roomid });
        if (!room) return false;
        const member = { id: user.id, memberName: user.name };
        const memberExists = room.members.some(memberObj => memberObj.id == user.id);

        if (!memberExists) {
            room.members.push(member);
            await room.save();
        }

        return room;
    } catch (error) {
        throw error;
    }
};


exports.createNewRoom = async (user) => {
    try {
        if (!user?.id || !user?.name) {
            throw new Error("Invalid user object");
        }

        let roomid;
        let existingRoom;

        do {
            roomid = generateRoomId();
            existingRoom = await Rooms.findOne({ roomId: roomid });
        } while (existingRoom);

        const room = await Rooms.create({
            hostid: user.id,
            hostname: user.name,
            roomId: roomid,
            members: [{}]
        });

        return room;

    } catch (error) {
        console.error(error);
        return { execution: false, error: error.message };
    }
};

exports.getHostNameByRoomId = async (roomId) => {
    try {
        const room = await Rooms.findOne({ roomId: roomId });
        return room.hostname;

    } catch (error) {
        console.error(error);
        return { execution: false, error: error.message };
    }
}

exports.closeRoom = async (roomId) => {
    try {

        await Rooms.deleteOne({ roomId: roomId });
        // const room = await Rooms.find({ hostid: req.user.id });
        
        // const room = await Rooms.findOne({ roomId: roomId });
        // return room.hostname;

    } catch (error) {
        console.error(error);
    }
}