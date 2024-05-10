import express from 'express';
import mongoose from 'mongoose';
import  dotenv from 'dotenv';

dotenv.config();
import UserRouter from './routes/users.js'

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connect DB Success!');
});
const app = express();
app.use(express.json());
app.use('/api/v1', UserRouter);

app.listen(process.env.PORT, async () => {
    console.log('Server is running!');
});