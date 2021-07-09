const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const jsonParser = require('body-parser').json();

const app = express();

app.use(jsonParser);
app.use(morgan("dev"));

const port = 3000;

// Connect to mongoDB
const url = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`;
const options = {
  poolSize: 10,
  useNewUrlParser: true, 
  useCreateIndex: true, 
  autoReconnect: true,
  useFindAndModify:false,
  reconnectTries: Number.MAX_VALUE
}

/**
 * Connect to the mongodb
 */
async function connectToDatabase() {
  mongoose.connect(url, options)
    .catch('[ X ] Error while connecting to the database, trying again..');
}

mongoose.connection.on('disconnected', () => {
  if (mongoose.connection.readyState === 0) {
    setTimeout(() => {
      connectToDatabase();
    }, 500);
  }
});

mongoose.connection.on('connected', () => {
  console.log('[ \u2713 ] Connected to the database!')
})

mongoose.connection.on('error', (error) => {
  console.log('[ X ] ' + error);
});

connectToDatabase();

// Routes
const playlistRouter = require('./routes/playlist');
app.use('/', playlistRouter);

// Listen on port
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

// Export
module.exports = app;
