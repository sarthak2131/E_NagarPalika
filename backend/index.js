import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';

dotenv.config();

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB with proper options
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});