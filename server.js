const express = require('express');
const mongo = require('mongodb').MongoClient;
const formidable = require('express-formidable');
const user = require('./controller/user');
const product = require('./controller/product');

const app = express();

global.db = null;
const sDatabasePath = 'mongodb://localhost:27017/dbexam';

mongo.connect(sDatabasePath, (err, db) => {
  if (err) {
    console.log("Couldn't connect to database");
    return false;
  }
  global.db = db;

  db.collection('users').createIndex({ email: 1, password: 1 });

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
      console.log('err');
      return res.json(false);
    }
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.get('/get-users/lng/:lng/lat/:lat', (req, res) => {
  const aLocation = [Number(req.params.lng), Number(req.params.lat)];
  user.getUsersGeo(aLocation, (err, data) => {
    if (err) {
      console.log('error');
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
    console.log(data);
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
  const jUserLogin = {
    email: req.fields.userEmail,
    password: req.fields.userPassword
  };
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
  const jUser = {
    name: req.fields.userName,
    lastName: req.fields.userLastName,
    password: req.fields.userPassword,
    email: req.fields.userEmail,
    phone: req.fields.userPhone,
    location: {
      type: 'Point',
      coordinates: [
        Number(req.fields.userPositionLng),
        Number(req.fields.userPositionLat)
      ]
    },
    userImg: req.files.userImg,
    isAdmin: true
  };

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
  const jUser = {
    id: req.fields.id,
    name: req.fields.userName,
    lastName: req.fields.userLastName,
    password: req.fields.userPassword,
    email: req.fields.userEmail,
    phone: req.fields.userPhone,
    userImg: req.files.userImg,
    isAdmin: req.fields.userIsAdmin ? true : false
  };

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
  const jProduct = {
    name: req.fields.productName,
    price: req.fields.productPrice,
    inventory: Number(req.fields.productInventory),
    productImg: req.files.productImg
  };
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
    if (err) {
      console.log('error');
    }
    res.json(data);
  });
});

/***********************************************/

/***********************************************/

app.post('/update-product/', (req, res) => {
  const jProduct = {
    id: req.fields.id,
    name: req.fields.productName,
    price: req.fields.productPrice,
    inventory: Number(req.fields.productInventory),
    productImg: req.files.productImg
  };
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

app.get('/buy-product/:productId/:userId', (req, res) => {
  const jOrder = {
    productId: req.params.productId,
    userId: req.params.userId
  };
  product.buyProduct(jOrder, (err, jProductInfo) => {
    if (err) {
      return res.json({ status: 'error' });
    }
    jProductInfo.status = 'success';
    res.json(jProductInfo);
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
