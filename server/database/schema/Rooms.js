const mongoose = require('mongoose');

const rooms = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    roomId: {
        type: String,
        default: ''
    },
    members: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('rooms', rooms);