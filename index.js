const express = require('express');
const app = express();
const path=require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/auth.route.js');
const bookRouter = require('./routes/book.route.js');
dotenv.config();

mongoose.connect(process.env.DB_CONNECT,()=>{
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.options('*', cors());

app.use('/user',userRouter);
app.use('/book',bookRouter);

app.listen(9000,()=>{
    console.log('Listening on port 9000');
})