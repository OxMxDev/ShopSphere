import { app } from '../src/app.js';
import connectDB from '../src/db/index.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

export default app;
