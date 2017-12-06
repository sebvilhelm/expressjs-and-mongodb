const express = require('express');
const fs = require('fs');
const mongodb = require('mongodb');
const formidable = require('express-formidable');
const user = require('./controller/user');

const app = express();

app.use(express.static('public'));
app.use(formidable());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/get-users', (req, res) => {
  user.getAllUsers((err, data) => {
    if (err) {
      console.log('oops');
      return res.json(false);
    }
    res.json(data);
  });
});

app.get('/get-user/:id', (req, res) => {
  const id = req.params.id;
  user.getUser(id, (err, data) => {
    res.json(data);
  });
});

app.get('/delete-user/:id', (req, res) => {
  const id = req.params.id;
  user.deleteUser(id, err => {
    if (err) {
      return res.send("Couldn't delete the user");
    }
    res.send('User deleted');
  });
});

app.listen('3000', err => {
  if (err) {
    console.log("Couldn't connect to port:3000");
    return false;
  }
  console.log('Server is running at port:3000');
});
