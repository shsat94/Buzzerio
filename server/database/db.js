const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const connectToDatabase = () => {
    try {
        mongoose.connect(mongoUri);
        console.log("Successfully Connected to Database");

    } catch (error) {
        console.log(error);
    }

}

module.exports = connectToDatabase;