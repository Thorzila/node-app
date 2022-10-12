'use strict';

const helmet = require('helmet');
const fs = require('fs');
const path = require('path')
const morgan = require('morgan');
// const logger = require('./middleware/logger');
const express = require('express');

// create template engine for pug

// App
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', require('./routes/home'));
app.use('/api/courses', require('./routes/courses'));


//app.use(logger);
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/debug.log'), { flags: 'a' })
// setup the logger
app.get('env') === 'development' ? app.use(morgan('tiny')) : app.use(morgan('combined', { stream: accessLogStream })) 

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`);
});
