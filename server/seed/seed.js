import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import { ensureAdmin } from '../utils/ensureAdmin.js';
import { ensureResources } from '../utils/ensureResources.js';

dotenv.config();
await connectDB();

const seed = async () => {
  const admin = await ensureAdmin();
  if (!admin) throw new Error('Admin seed failed. Check ADMIN_EMAIL and ADMIN_PASSWORD in .env.');

  const demoUsers = [
    {
      name: 'Aarav Student',
      email: 'student@campus.edu',
      password: 'student123',
      role: 'student',
      department: 'CSE'
    },
    {
      name: 'Dr. Meera Faculty',
      email: 'faculty@campus.edu',
      password: 'faculty123',
      role: 'faculty',
      department: 'ECE'
    }
  ];

  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ email: demoUser.email });
    if (!existingUser) await User.create(demoUser);
  }

  await ensureResources(admin._id);

  console.log('Seed complete');
  console.log(`Admin: ${process.env.ADMIN_EMAIL} / password from .env`);
  console.log('Student: student@campus.edu / student123');
  console.log('Faculty: faculty@campus.edu / faculty123');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
