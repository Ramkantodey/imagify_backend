
import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {

    });

    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`);
};

export default connectDB;
