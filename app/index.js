const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const db = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

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

// Passport config
require('./config/passport')(passport);

// Routes
app.get('/', (req, res) => res.send('Hello'));
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port - ${port}`));
