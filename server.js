const express = require('express');
const fs = require('fs');
const mongodb = require('mongodb');
const formidable = require('formidable');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen('3000', err => {
  if (err) {
    console.log("Couldn't connect to port 3000");
    return false;
  }
  console.log('Server is running at port 3000');
});
