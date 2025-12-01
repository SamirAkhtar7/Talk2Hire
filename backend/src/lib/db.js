import mongoose from 'mongoose';
import { ENV } from './env.js';
 
export  const connectDB = async() => {
    try {

        if(!ENV.DB_URI) {
            throw new Error('DB_URI is not defined in environment variables');
        }
        await mongoose.connect(ENV.DB_URI, {});
        console.log('✔️ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
}
