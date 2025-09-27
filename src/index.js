import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './db/index.js';

connectDB()