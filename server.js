'use strict';

const Joi = require('joi');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path')
const morgan = require('morgan');
const logger = require('./logger');
const express = require('express');

// create template engine for pug

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', require('./routes/courses'));

app.set('view engine', 'pug');
app.set('views', './views'); // default

//app.use(logger);
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/debug.log'), { flags: 'a' })
// setup the logger
app.get('env') === 'development' ? app.use(morgan('tiny')) : app.use(morgan('combined', { stream: accessLogStream })) 

app.get('/', (req, res) => {
  res.render('index', { title: 'My Express App', message: 'Hello' });
});


const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`);
});
