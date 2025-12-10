import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sport from './models/Sport.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sports = [
  { name: 'Soccer' },
  { name: 'Basketball' },
  { name: 'Tennis' },
  { name: 'Baseball' },
  { name: 'Cricket' },
  { name: 'Volleyball' },
  { name: 'Rugby' },
  { name: 'Golf' },
  { name: 'Hockey' },
  { name: 'Badminton' },
  { name: 'Swimming' },
  { name: 'Athletics' },
  { name: 'Boxing' },
];

const importData = async () => {
  try {
    await connectDB();

    for (const sport of sports) {
      const exists = await Sport.findOne({ name: sport.name });
      if (!exists) {
        await Sport.create(sport);
        console.log(`Added: ${sport.name}`);
      }
    }

    console.log('Sports Import Completed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();