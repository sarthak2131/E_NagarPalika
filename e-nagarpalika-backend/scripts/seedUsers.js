import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const users = [
  {
    username: 'cmo@nagarpalika.gov.in',
    password: 'Cmo@2024',
    role: 'CMO'
  },
  {
    username: 'nodal@nagarpalika.gov.in',
    password: 'Nodal@2024',
    role: 'NodalOfficer'
  },
  {
    username: 'commissioner@nagarpalika.gov.in',
    password: 'Commissioner@2024',
    role: 'Commissioner'
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
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