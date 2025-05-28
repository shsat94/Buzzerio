const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const connectToDatabase = () => {
    try {
        mongoose.connect(mongoUri);
        ("Successfully Connected to Database");

    } catch (error) {
        (error);
    }

}

module.exports = connectToDatabase;