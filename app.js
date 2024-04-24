const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const {login, createUser} = require('./controllers/users');

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const routes = require('./routes');

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(routes);
app.use(cors());

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});