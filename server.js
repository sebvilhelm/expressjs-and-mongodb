const express = require('express');
const fs = require('fs');
const mongodb = require('mongodb');
const formidable = require('formidable');
const user = require('./controller/user');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/get-users', (req, res) => {
  user.getAllUsers(data => {
    res.json(data);
  });
});

app.listen('3000', err => {
  if (err) {
    console.log("Couldn't connect to port 3000");
    return false;
  }
  console.log('Server is running at port 3000');
});
