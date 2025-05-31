const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        }
    },
    googleId: {
        type: String,
        sparse: true, 
        unique: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'both'],
        default: 'local'
    },
    noOfRooms: {
        type: Number,
        default: 2
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('user', userSchema);