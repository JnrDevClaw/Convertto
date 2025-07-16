import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

// Validate essential environment variables on startup
if (!process.env.MONGODB_URI || !process.env.JWT_KEY) {
    console.error("FATAL ERROR: MONGODB_URI and JWT_KEY must be defined in the .env file.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process with failure
    }
};

const startServer = async () => {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
};

startServer();