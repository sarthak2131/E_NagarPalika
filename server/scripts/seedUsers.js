import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Employee users from sampleUsers.json
const sampleUsersPath = path.resolve(__dirname, 'sampleUsers.json');
const employeeUsers = JSON.parse(fs.readFileSync(sampleUsersPath, 'utf-8'));

const users = [
  ...employeeUsers
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop users collection if it exists
    try {
      await mongoose.connection.collection('users').drop();
      console.log('Dropped users collection');
    } catch (err) {
      if (err.code === 26) {
        console.log('users collection does not exist, skipping drop');
      } else {
        throw err;
      }
    }

    // Clear existing users (redundant, but safe)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();