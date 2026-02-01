import { app } from '../src/app.js';
import connectDB from '../src/db/index.js';

// Cache the database connection promise for serverless
let isConnected = false;

const handler = async (req, res) => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    return app(req, res);
};

export default handler; 
