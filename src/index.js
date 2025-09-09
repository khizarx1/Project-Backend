// require('dotenv').config({path: './.env'});
import { app } from './app.js'
import connectDB from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
            app.on('error', (error) => {
                console.error('Error:', error);
                throw error
            })
        })
    })
    .catch((error) => {
        console.error('MONGOGO DB connection FAILED in : src/index.js', error)
    })





















/*
import mongoose from 'mongoose';
import { DB_NAME} from './constants';
import express from 'express';
const app = express()
;(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on(error, (error) => {
        console.error('MongoDB connection error:', error);
        throw error;
       }) 

       app.listen(process.env.PORT, () => {
        console.log(`server is running on port ${process.env.PORT}`);
       })

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
})()
*/