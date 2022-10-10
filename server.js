'use strict';

const Joi = require('joi');
const express = require('express');

// App
const app = express();
app.use(express.json());

// const array of courses
const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
  return res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const course = {
      id: courses.length + 1,
      name: req.body.name
    };
    courses.push(course);
    res.send(course);
  } catch (error) {
    res.status(503).send('Internal Server Error');
  }
});

app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  // If not existing, return 404
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Update course
  course.name = req.body.name;
  // Return the updated course
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  // Not existing, return 404
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(6).required()
  });
  return schema.validate(course);
}

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`);
});
