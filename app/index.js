const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB Config
const db = require('./config/keys');

// Connect to MongoDB
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    auth: {
      user: db.mongoUser,
      password: db.mongoPasswd,
    },
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(error => console.log(error));

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port - ${port}`));
