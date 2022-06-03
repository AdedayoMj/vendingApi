import mongoose from 'mongoose';
import config from 'config';
const MONGO_USERNAME = process.env.MONGODB_USERNAME as string 
const MONGO_PASSWORD = process.env.MONGODB_PASSWORD  as string
const MONGO_HOST = process.env.MONGO_URL 
// const dbUrl = `mongodb://${config.get('dbName')}:${config.get(
//   'dbPass'
// )}@localhost:6000/mvpVendingMachine?authSource=admin`;
const url= `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@mvpvendingapi.ds8ed.mongodb.net/?retryWrites=true&w=majority`

const dbUrl = String(url)
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`);
    console.log('Database connected...');
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;