import mongoose  from "mongoose";

export const connectDb  = async ()=>{
       try{
        const mongodbURI = process.env.MONGODB_URI;
        if (!mongodbURI) {
            throw new Error('MONGODB_URI not found in environment variables.');
        }    

        await mongoose.connect(mongodbURI)
        console.log('Database connected successfully');
       } catch (error) {
        console.error('Error connecting to the database:', error);
       }
    
}