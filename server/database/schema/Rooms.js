const mongoose = require('mongoose');

const rooms = new mongoose.Schema({
    hostid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    hostname: {
        type: String,
        ref: 'user'
    },
    roomId: {
        type: String,
        default: ''
    },
    validDate: {
        type: Date,
        default: Date.now()
    },
    members: {
        type: [
            {
                id: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'user' 
                },
                memberName: {
                    type: String
                }
            }
        ],
        default: []
    }
});

module.exports = mongoose.model('rooms', rooms);
