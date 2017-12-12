var sUserIdToEdit = '',
  sProductIdToEdit = '',
  bMapIsReady = false;
var jCurrentUser = {},
  jUserPosition = {};

(function() {})();

function loginUser() {
  var jFrm = new FormData(frmLogin);
  doAjax(
    'POST',
    '/login/',
    function(res) {
      var jRes = JSON.parse(res);
      if (jRes.status == 'success') {
        jCurrentUser.id = jRes.user._id;
        jCurrentUser.isAdmin = jRes.user.isAdmin;
        menu.classList.remove('hide');
        showUserProfile(jCurrentUser.id);
        showAndHideAdminButtons();
        showPage('pageProfile');
      }
    },
    jFrm
  );
}

function logoutUser() {
  doAjax('GET', 'api-destroy-session.php', function(res) {
    var jRes = JSON.parse(res);
    if (jRes.status == 'success') {
      menu.classList.add('hide');
      showPage('pageLogin');
    }
  });
}

function showAndHideAdminButtons() {
  var adminOnlyElem = document.querySelectorAll('.onlyForAdmin');
  for (var i = 0; i < adminOnlyElem.length; i++) {
    if (jCurrentUser.isAdmin) {
      adminOnlyElem[i].classList.remove('hide');
    } else {
      adminOnlyElem[i].classList.add('hide');
    }
  }
}

// CRUD USERS
function createUser() {
  var jFrm = new FormData(frmSignup);
  jFrm.append('userPositionLng', jUserPosition.lng);
  jFrm.append('userPositionLat', jUserPosition.lat);
  doAjax(
    'POST',
    '/save-user/',
    function(res) {
      var jRes = JSON.parse(res);
      if (jRes.status == 'success' && !jCurrentUser.id) {
        jCurrentUser.id = jRes.user._id;
        jCurrentUser.isAdmin = jRes.user.isAdmin;
        console.log('user created');
        menu.classList.remove('hide');
        showUserProfile();
        showPage('pageProfile');
      } else if (jRes.status == 'success') {
        showUsers();
        showPage('pageAllUsers');
      } else {
        console.log('error');
      }
    },
    jFrm
  );
}

function deleteUser(id) {
  doAjax('GET', 'delete-user/' + id, function(res) {
    console.log(res);
  });
}

function showUsers() {
  doAjax('GET', '/get-users/', function(res) {
    var ajUsers = JSON.parse(res);
    var sUserList = '';

    for (var i = 0; i < ajUsers.length; i++) {
      var sId = ajUsers[i]._id;
      var sFullName = ajUsers[i].name + ' ' + ajUsers[i].lastName;
      var sPhone = ajUsers[i].phone;
      var sEmail = ajUsers[i].email;
      var sImgSrc = ajUsers[i].img;
      var sImgElem = sImgSrc
        ? '<img src="' + sImgSrc + '" alt="' + sFullName + 's profile picture">'
        : '';
      var sAdminBtn = jCurrentUser.isAdmin
        ? '<button class="btnDeleteUser">delete</button><button class="btnEditUser">edit</button>'
        : '';
      sUserList +=
        '<li class="userCard" data-userid="' +
        sId +
        '">\
                ' +
        sImgElem +
        '\
                <dl>\
                  <dt>Name</dt>\
                  <dd>' +
        sFullName +
        '</dd>\
                  <dt>E-mail</dt>\
                  <dd>' +
        sEmail +
        '</dd>\
                  <dt>Phone</dt>\
                  <dd>' +
        sPhone +
        '</dd>\
                </dl>\
                <button class="btnShowProfile">Profile</button>' +
        sAdminBtn +
        '\
              </li>';
    }
    userList.innerHTML = sUserList;
  });
}

function showUsersWithinRadius() {
  const jPosition = jUserPosition;
  doAjax(
    'GET',
    '/get-users/lng/' + jPosition.lng + '/lat/' + jPosition.lat,
    function(res) {
      var ajUsers = JSON.parse(res);
      var sUserList = '';

      for (var i = 0; i < ajUsers.length; i++) {
        var sId = ajUsers[i]._id;
        var sFullName = ajUsers[i].name + ' ' + ajUsers[i].lastName;
        var sPhone = ajUsers[i].phone;
        var sEmail = ajUsers[i].email;
        var sImgSrc = ajUsers[i].img;
        var sImgElem = sImgSrc
          ? '<img src="' +
            sImgSrc +
            '" alt="' +
            sFullName +
            's profile picture">'
          : '';
        var sAdminBtns = jCurrentUser.isAdmin
          ? '<button class="btnDeleteUser">delete</button><button class="btnEditUser">edit</button>'
          : '';
        sUserList +=
          '<li class="userCard" data-userid="' +
          sId +
          '">\
                ' +
          sImgElem +
          '\
                <dl>\
                  <dt>Name</dt>\
                  <dd>' +
          sFullName +
          '</dd>\
                  <dt>E-mail</dt>\
                  <dd>' +
          sEmail +
          '</dd>\
                  <dt>Phone</dt>\
                  <dd>' +
          sPhone +
          '</dd>\
                </dl>\
                <button class="btnShowProfile">Profile</button>' +
          sAdminBtns +
          '\
              </li>';
      }
      userList.innerHTML = sUserList;
    }
  );
}

function showUserInfoToEdit(id) {
  doAjax('GET', '/get-user/' + id, function(res) {
    var jUser = JSON.parse(res);
    inputEditUserName.value = jUser.name;
    inputEditUserLastName.value = jUser.lastName;
    inputEditUserPassword.value = jUser.password;
    inputEditUserEmail.value = jUser.email;
    inputEditUserPhone.value = jUser.phone;

    sUserIdToEdit = jUser._id;

    var userMap = document.getElementById('map');

    initMap(jUser.location, userMap);

    if (jUser.isAdmin) {
      inputEditUserIsAdmin.checked = true;
    } else {
      inputEditUserIsAdmin.checked = false;
    }
  });
}

function showUserProfile(userId) {
  doAjax('GET', '/get-user/' + userId, function(res) {
    var jUser = JSON.parse(res);
    var sId = jUser._id;
    var sFullName = jUser.name + ' ' + jUser.lastName;
    var sPhone = jUser.phone;
    var sEmail = jUser.email;
    var sImgSrc = jUser.img;
    var sImgElem = sImgSrc
      ? '<img src="' + sImgSrc + '" alt="' + sFullName + 's profile picture">'
      : '';
    var sUserList =
      '<div data-userid="' +
      sId +
      '">\
              ' +
      sImgElem +
      '\
              <dl>\
                <dt>Name</dt>\
                <dd>' +
      sFullName +
      '</dd>\
                <dt>E-mail</dt>\
                <dd>' +
      sEmail +
      '</dd>\
                <dt>Phone</dt>\
                <dd>' +
      sPhone +
      '</dd>\
              </dl>\
              <button class="btnDeleteUser">delete</button>\
              <button class="btnEditUser">edit</button>\
            </div>';
    userProfile.innerHTML = sUserList;
  });
}

function editUser() {
  var jFrm = new FormData(frmEditUser);
  jFrm.append('id', sUserIdToEdit);
  doAjax(
    'POST',
    '/update-user/',
    function(res) {
      console.log(res);
      showUsers();
      showPage('pageAllUsers');
    },
    jFrm
  );
}

// PRODUCTS CRUD
function showProducts() {
  doAjax('GET', '/get-products/', function(res) {
    var ajProducts = JSON.parse(res);
    var sProductList = '';
    for (var i = 0; i < ajProducts.length; i++) {
      var sId = ajProducts[i]._id;
      var sName = ajProducts[i].name;
      var sPrice = ajProducts[i].price;
      var sInventory = ajProducts[i].inventory;
      var sImgSrc = ajProducts[i].img;
      var sImgElem = sImgSrc
        ? '<img src="' + sImgSrc + '" alt="' + sName + '">'
        : '';
      var sAdminBtn = jCurrentUser.isAdmin
        ? '<button class="btnDeleteProduct">delete</button><button class="btnEditProduct">edit</button>'
        : '';
      sProductList +=
        '<li class="productCard" data-productid="' +
        sId +
        '">\
                  ' +
        sImgElem +
        '\
                  <dl>\
                    <dt>Name</dt>\
                    <dd>' +
        sName +
        '</dd>\
                    <dt>Price</dt>\
                    <dd>' +
        sPrice +
        '</dd>\
                    <dt>Available</dt>\
                    <dd id="inventoryCounter-' +
        sId +
        '">' +
        sInventory +
        '</dd>\
                  </dl>\
                  <button class="btnBuyProduct">buy</button>\
                  ' +
        sAdminBtn +
        '\
                </li>';
    }
    productList.innerHTML = sProductList;
  });
}

function createProduct() {
  var jFrm = new FormData(frmAddProduct);
  doAjax(
    'POST',
    '/save-product/',
    function(res) {
      var jRes = JSON.parse(res);
      if (jRes.status == 'success') {
        showProducts();
        showPage('pageAllProducts');
      } else {
        console.log('error');
      }
    },
    jFrm
  );
}

function deleteProduct(id) {
  doAjax('GET', '/delete-product/' + id, function(res) {
    console.log(res);
  });
}

function showProductInfoToEdit(id) {
  doAjax('GET', '/get-product/' + id, function(res) {
    var jProduct = JSON.parse(res);
    inputEditProductName.value = jProduct.name;
    inputEditProductPrice.value = jProduct.price;
    inputEditProductInventory.value = jProduct.inventory;

    sProductIdToEdit = id;
  });
}

function editProduct() {
  var jFrm = new FormData(frmEditProduct);
  jFrm.append('id', sProductIdToEdit);
  doAjax(
    'POST',
    '/update-product/',
    function(res) {
      var jRes = JSON.parse(res);
      if (jRes.status == 'success') {
        console.log('success');
        showProducts();
        showPage('pageAllProducts');
      }
    },
    jFrm
  );
}

// BUY PRODUCT
function buyProduct(id) {
  doAjax('GET', '/buy-product/' + id + '/' + jCurrentUser.id, function(res) {
    var jRes = JSON.parse(res);
    var jNotifOptions = {
      title: 'Oops!',
      message: "We couldn't process your purchase at this time"
    };
    if (jRes.status == 'success') {
      // Write notifications message and properties
      var sMessage = 'You bought a ' + jRes.name;
      jNotifOptions = {
        title: 'Congratulations',
        message: sMessage,
        sound: 'sound/sound_cash.mp3',
        icon: 'img/icons/icon_dollar.png'
      };
      // change inventory counter
      var sIdSelector = 'inventoryCounter-' + id;
      var inventoryCounter = document.getElementById(sIdSelector);
      inventoryCounter.innerHTML = jRes.inventory;
    } else if (jRes.status == 'noProducts') {
      var sMessage = 'We ran out of ' + jRes.name;
      jNotifOptions = {
        title: 'Oh no!',
        message: sMessage,
        sound: 'sound/sound_trombone.mp3',
        icon: 'img/icons/icon_sad.png'
      };
    } else {
    }
    notifyMe(jNotifOptions);
  });
}

// Click events
document.addEventListener('click', function(e) {
  if (e.target.id == 'btnSignupSubmit') {
    createUser();
  } else if (e.target.id == 'btnLoginSubmit') {
    loginUser();
  } else if (e.target.classList.contains('btnDeleteUser')) {
    var sUserId = e.target.parentNode.dataset.userid;
    deleteUser(sUserId);
    e.target.parentNode.remove();
  } else if (e.target.classList.contains('btnEditUser')) {
    var sUserId = e.target.parentNode.dataset.userid;
    showUserInfoToEdit(sUserId);
    showPage('pageEditUser');
  } else if (e.target.classList.contains('btnShowProfile')) {
    var sUserId = e.target.parentNode.dataset.userid;
    showUserProfile(sUserId);
    showPage('pageProfile');
  } else if (e.target.id == 'btnEditUserSubmit') {
    editUser();
  } else if (e.target.id == 'btnLogout') {
    logoutUser();
  } else if (e.target.id == 'btnAddProduct') {
    createProduct();
  } else if (e.target.classList.contains('btnDeleteProduct')) {
    var sProductId = e.target.parentNode.dataset.productid;
    deleteProduct(sProductId);
    e.target.parentNode.remove();
  } else if (e.target.classList.contains('btnEditProduct')) {
    var sProductId = e.target.parentNode.dataset.productid;
    showProductInfoToEdit(sProductId);
    showPage('pageEditProduct');
  } else if (e.target.classList.contains('btnBuyProduct')) {
    var sProductId = e.target.parentNode.dataset.productid;
    buyProduct(sProductId);
  } else if (e.target.id == 'btnEditProductSubmit') {
    editProduct();
  } else if (e.target.id == 'btnGeoQuery') {
    if (jUserPosition.lat && jUserPosition.lng) {
      showUsersWithinRadius();
      return;
    }
    getUserPosition(function() {
      showUsersWithinRadius();
    });
  } else if (e.target.id == 'btnSubscribe') {
    subscribeNewsletter();
  } else if (e.target.classList.contains('btnMenu')) {
    // Navigation
    var pageToShow = e.target.dataset.targetpage;
    showPage(pageToShow);

    if (pageToShow == 'pageAllUsers') {
      showUsers();
    } else if (pageToShow == 'pageAllProducts') {
      showProducts();
    } else if (pageToShow == 'pageProfile') {
      showUserProfile(jCurrentUser.id);
    } else if (pageToShow == 'pageSignup') {
      getUserPosition(function() {
        var signupMap = document.getElementById('signupMap');
        initMap(jUserPosition, signupMap);
      });
    }
  }
});

// AJAX FUNCTION
function doAjax(method, api, callback, formData) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) {
      var res = this.responseText;
      callback(res);
    }
  };
  ajax.open(method, api, true);
  if (method == 'POST' && formData) {
    ajax.send(formData);
  } else {
    ajax.send();
  }
}

// SHOW NOTIFICATION
function displayNotification(jOptions) {
  var oSound = new Audio(jOptions.sound);
  oSound.play();
  var notification = new Notification(jOptions.title, {
    body: jOptions.message,
    icon: jOptions.icon
  });
}

function notifyMe(jOptions) {
  if (Notification.permission === 'granted') {
    displayNotification(jOptions);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function(permission) {
      if (permission === 'granted') {
        displayNotification(jOptions);
      }
    });
  }
}

function showPage(pageId) {
  var aPages = document.querySelectorAll('.page');
  for (var i = 0; i < aPages.length; i++) {
    aPages[i].classList.add('hide');
  }
  var pageToShow = document.getElementById(pageId);
  pageToShow.classList.remove('hide');
}

function setMapIsReady() {
  bMapIsReady = true;
}

function getUserPosition(callback) {
  navigator.geolocation.getCurrentPosition(function(res) {
    jUserPosition = {
      lat: res.coords.latitude,
      lng: res.coords.longitude
    };
    callback();
  });
}

//GOOGLE MAP
function initMap(jCenter, divMap) {
  if (bMapIsReady) {
    var map = new google.maps.Map(divMap, {
      zoom: 16,
      center: jCenter
    });

    var marker = new google.maps.Marker({
      map: map,
      position: jCenter
    });
  } else {
    console.log('Google Maps is not ready');
  }
}
