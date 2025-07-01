const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
const connectToDb = require('./db/db');
connectToDb();

const userRoutes = require('./routes/user.route');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoutes);  


app.get('/', (req, res) => {
  res.status(201).send('Hello, World!');    
});

module.exports = app;