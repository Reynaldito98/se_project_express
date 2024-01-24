const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  req.user = {
    _id: '65b09a81c94d3d9f8d9b741f'
  };
  next();
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('This is working');
});