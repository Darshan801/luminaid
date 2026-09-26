require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cloudinaryRoutes = require('./routes/cloudinaryRoutes');


require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cloudinary', cloudinaryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(process.env.PORT, () => {
      console.log(`Backend running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });