const express = require('express');
const mongo = require('mongodb').MongoClient;
const formidable = require('express-formidable');
const user = require('./controller/user');
const product = require('./controller/product');

const app = express();

global.db = null;
const sDatabasePath = 'mongodb://localhost:27017/dbexam';

mongo.connect( sDatabasePath , (err , db) => {
  if( err ){
    console.log("Couldn't connect to database");
    return false;
  }
  global.db = db;

  console.log('Connected to database!');
});

app.use(express.static('public'));
app.use(formidable());

/***********************************************/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/***********************************************/
// USERS
/***********************************************/

app.get('/get-users/', (req, res) => {
  user.getAllUsers((err, data) => {
    if (err) {
      console.log(err);
      return res.json(false);
    }
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.get('/get-user/:id', (req, res) => {
  const id = req.params.id;
  user.getUser(id, (err, data) => {
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.get('/delete-user/:id', (req, res) => {
  const id = req.params.id;
  user.deleteUser(id, err => {
    if (err) {
      return res.send("Couldn't delete the user");
    }
    res.send('User deleted');
  });
});

/***********************************************/

/***********************************************/

app.post('/login/', (req, res) => {
  const jUserLogin = req.fields;
  user.loginUser(jUserLogin, (err, userData) => {
    const response = {
      status: 'err'
    };
    if (err) {
      return res.json(response);
    }
    response.status = 'success';
    response.user = userData;
    return res.json(response);
  });
});

/***********************************************/

/***********************************************/

app.post('/save-user/', (req, res) => {
  const jUser = req.fields;
  const file = req.files;

  jUser.userImg = file.userImg;
  user.saveUser(jUser, (err, jUserCreated) => {
    const jRes = {
      status: 'success',
      user: jUserCreated
    };
    if (err) {
      jRes.status = 'error';
    }
    res.json(jRes);
  });
});

/***********************************************/

/***********************************************/

app.post('/update-user/', (req, res) => {
  const jUser = req.fields;
  const file = req.files;
  jUser.userImg = file.userImg;

  user.updateUser(jUser, err => {
    const jRes = {
      status: 'success'
    };
    if (err) {
      jRes.status = 'error';
    }
    res.json(jRes);
  });
});

/***********************************************/
// Products
/***********************************************/

app.get('/get-products/', (req, res) => {
  product.getAllProducts((err, data) => {
    if (err) {
      console.log(err);
      return res.json(false);
    }
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.post('/save-product/', (req, res) => {
  const jProduct = req.fields;
  const file = req.files;

  jProduct.productImg = file.productImg;
  product.saveProduct(jProduct, (err, jProductCreated) => {
    const jRes = {
      status: 'success',
      products: jProductCreated
    };
    if (err) {
      jRes.status = 'error';
    }
    res.json(jRes);
  });
});

/***********************************************/

/***********************************************/

app.get('/get-product/:id', (req, res) => {
  const id = req.params.id;
  product.getProduct(id, (err, data) => {
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.post('/update-product/', (req, res) => {
  const jProduct = req.fields;
  const file = req.files;
  jProduct.productImg = file.productImg;

  product.updateProduct(jProduct, err => {
    const jRes = {
      status: 'success'
    };
    if (err) {
      jRes.status = 'error';
    }
    res.json(jRes);
  });
});

/***********************************************/

/***********************************************/

app.get('/delete-product/:id', (req, res) => {
  const id = req.params.id;
  product.deleteProduct(id, err => {
    if (err) {
      return res.send("Couldn't delete the product");
    }
    res.send('product deleted');
  });
});

/***********************************************/

/***********************************************/

app.get('/buy-product/:id', (req, res) => {
  const id = req.params.id;
  product.buyProduct(id, (err, jResponseFromController) => {
    const jRes = jResponseFromController || { status: 'error' };
    res.json(jRes);
  });
});

/***********************************************/

/***********************************************/

app.listen('3000', err => {
  if (err) {
    console.log("Couldn't connect to port:3000");
    return false;
  }
  console.log('Server is running at port:3000');
  return true;
});
/***********************************************/
