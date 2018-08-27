const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { Client } = require('pg');

const client = new Client({
  database: 'deatjh8dni4e5m',
  user: 'qseerelbxgffyi',
  password: '9b1dd5ea684422c5fe984b94449a90a544b997a33ceaf5ae5eb3c652a70a4fef',
  host: 'ec2-54-83-12-150.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});

client.connect()
  .then(function () {
    console.log('Connected to database');
  })
  .catch(function (err) {
    if (err) {}
    console.log('Cannot connect to database');
  });

const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Client

app.get('/', function (req, res) {
  res.render('home', {

  });
});

app.get('/products', (req, res) => {
  client.query('SELECT * FROM products;', (req, data) => {
    var list = [];

    for (var i = 0; i < data.rows.length; i++) {
      list.push(data.rows[i]);
    }
    res.render('products', {
      data: list,
      title: 'My Makeup World'
    });
  });
});

app.get('/products/:id', (req, res) => {
  var id = req.params.id;
  client.query('SELECT * FROM products WHERE id = $1', [id], (req, data) => {
    client.query('SELECT * FROM brands WHERE id = $1', [data.rows[0].brand_id], (err, data2) => {
      if (err) {}
      res.render('product-details', {
        product_name: data.rows[0].name,
        product_id: data.rows[0].id,
        product_description: data.rows[0].description,
        product_tagline: data.rows[0].tagline,
        product_price: data.rows[0].price,
        product_warranty: data.rows[0].warranty,
        product_brand_id: data.rows[0].brand_id,
        product_category_id: data.rows[0].category_id,
        product_image: data.rows[0].image,
        product_brand: data2.rows[0].brand_name
      });
    });
  });
});

app.post('/products/:id/send', function (req, res) {
  client.query("INSERT INTO customers (email, first_name, middle_name, last_name, state, city, street, zipcode) VALUES ('" + req.body.email + "', '" + req.body.first_name + "', '" + req.body.middle_name + "', '" + req.body.last_name + "', '" + req.body.state + "', '" + req.body.city + "', '" + req.body.street + "', '" + req.body.zipcode + "') ON CONFLICT (email) DO UPDATE SET first_name = '" + req.body.first_name + "', middle_name = '" + req.body.middle_name + "', last_name = '" + req.body.last_name + "', state = '" + req.body.state + "', city = '" + req.body.city + "', street = '" + req.body.street + "', zipcode = '" + req.body.zipcode + "' WHERE customers.email ='" + req.body.email + "';");
  console.log(req.body);

  client.query("SELECT id FROM customers WHERE email = '" + req.body.email + "';")
    .then((results) => {
      var id = results.rows[0].id;
      console.log(id);
      client.query('INSERT INTO orders (product_id,customer_id,quantity) VALUES (' + req.params.id + ', ' + id + ', ' + req.body.quantity + ')')

        .then((results) => {
          var maillist = ['dbmsteam15@gmail.com', req.body.email];
          var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'dbmsteam15@gmail.com',
              pass: 'team15@dbms'
            }
          });
          const mailOptions = {
            from: '"Team 15" <dbmsteam15@gmail.com>',
            to: maillist,
            subject: 'Order Request Information',
            html:

    '<table>' +
    '<thead>' +
    '<tr>' +
    '<th>Customer</th>' +
    '<th>Name</th>' +
    '<th>Email</th>' +
    '<th>Product</th>' +
    '<th>Quantity</th>' +
    '</tr>' +
    '<thead>' +
    '<tbody>' +
    '<tr>' +
    '<td>' + req.body.first_name + '</th>' +
    '<td>' + req.body.last_name + '</td>' +
    '<td>' + req.body.email + '<td>' +
    '<td>' + req.body.products_name + '</td>' +
    '<td>' + req.body.quantity + '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>'
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.redirect('/products');
          });
        })
        .catch((err) => {
          console.log('error', err);
          res.send('Error!');
        });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/member1', function (req, res) {
  res.render('members', {
    name: 'Romar Dizon',
    email: 'romardizon27@gmail.com',
    phone: '09213309976',
    imageurl: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/15284927_1275474115852962_685390893495489160_n.jpg?_nc_cat=0&_nc_eui2=AeHCALjlEfR9s5Pouq9YJJQDWG3Hy6mo1REBqs48K1kNT0d_tMukn5-RE1iw3NBxkFiMnKYdXQUHQ11RDborwINnmCWWV8GtJipg5gsY73u7iw&oh=681069f3182f2d5961ab81639570f4e8&oe=5BC8995F',
    hobbies: ['Playing Basketball', 'Playing Badminton', 'Playing Dota', 'Watching Movies', 'Dancing']

  });
});

app.get('/member2', function (req, res) {
  res.render('members', {
    name: 'Danica Dadia',
    email: 'danicadadia.dd@gmail.com',
    phone: '09297567752',
    imageurl: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/26229420_2164092686964723_3022482758723077958_n.jpg?_nc_cat=0&_nc_eui2=AeHuBXDXg38sC4JhAEnnlFggZE4VngC4GqR8GpT9Mgzaq4_1p8gjo2M23vhAjZ1ctPLULalQ7r0CKnBEFbdY0U5aMz1GRBdp6P-Cjc7himBN9w&oh=cc12724b1e7da212bf7f1e2a379bbfd4&oe=5BFF378E',
    hobbies: ['Watching Movies', 'Dancing', 'Makeup']

  });
});

// admin side

app.get('/customers', function (req, res) {
  client.query('SELECT * FROM customers ORDER BY id DESC')
    .then((data) => {
      console.log('results?', data.rows);
      res.render('customers', { layout: 'submain',
        result: data.rows
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/customers/:id', function (req, res) {
  client.query("SELECT customers.first_name AS first_name, customers.middle_name AS middle_name, customers.last_name AS last_name, customers.email AS email, customers.state AS state, customers.city AS city, customers.street AS street, customers.zipcode AS zipcode, products.name AS product_name, orders.quantity AS quantity, orders.purchase_date AS purchase_date FROM orders INNER JOIN customers ON orders.customer_id=customers.id INNER JOIN products ON orders.product_id=products.id WHERE customers.id = '" + req.params.id + "' ORDER BY purchase_date DESC;")
    .then((data) => {
      console.log('results?', data);
      res.render('customer-details', { layout: 'submain',
        result: data.rows
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/orders', function (req, res) {
  client.query('SELECT customers.first_name AS first_name, customers.middle_name AS middle_name, customers.last_name AS last_name, customers.email AS email, products.name AS products_name, orders.purchase_date AS purchase_date, orders.quantity AS quantity FROM orders INNER JOIN products ON orders.product_id=products.id INNER JOIN customers ON orders.customer_id=customers.id ORDER BY purchase_date DESC;')
    .then((data) => {
      console.log('results?', data);
      res.render('orders', { layout: 'submain',
        result: data.rows
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.post('/products/:id/forms', function (req, res) {
  client.query('SELECT products.name AS name, products.id AS id FROM products LEFT JOIN brands ON products.brand_id=brands.id RIGHT JOIN products_category ON products.category_id=products_category.id WHERE products.id = ' + req.params.id + ';')
    .then((results) => {
      console.log('results?', results);
      res.render('form', {
        name: results.rows[0].name
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/product/add', function (req, res) {
  res.render('add-product', { layout: 'submain'

  });
});

app.get('/update/products/:id', function (req, res) {
  client.query('SELECT * FROM products WHERE id = $1', [req.params.id], (err, data) => {
    if (err) {}
    client.query('SELECT * from brands', (err2, databrands) => {
      client.query('SELECT * FROM products_category', (err3, datacategory) => {
        res.render('update-products', { layout: 'submain',
          product_name: data.rows[0].name,
          product_id: data.rows[0].id,
          product_description: data.rows[0].description,
          product_tagline: data.rows[0].tagline,
          product_price: data.rows[0].price,
          product_warranty: data.rows[0].warranty,
          product_brand_id: data.rows[0].brand_id,
          product_category_id: data.rows[0].category_id,
          brands: databrands.rows,
          categories: datacategory.rows
        });
      });
    });
  });
});

app.post('/update/product/form', function (req, res) {
  const query = {
    text: 'UPDATE products SET name = $1, description = $2, tagline = $3, price = $4, warranty = $5, brand_id = $6, image= $7, category_id = $8 WHERE id = $9',
    values: [req.body.product_name, req.body.product_description, req.body.product_tagline, req.body.product_price, req.body.product_warranty, req.body.product_brand, req.body.product_category, req.body.product_id, req.body.product_image]
  };
  console.log(query);
  client.query(query, (req, data) => {
    res.redirect('/products');
  });
});

app.post('/update/products', function (req, res) {
  var id = req.body.product_id;
  console.log(id);
  res.redirect('/update/products/' + id);
});

app.get('/category/create', function (req, res) {
  res.render('create-category', { layout: 'submain'

  });
});

app.get('/brand/create', function (req, res) {
  res.render('create-brand', { layout: 'submain'

  });
});

app.post('/brand/create/saving', function (req, res) {
  console.log(req.body);
  client.query("INSERT INTO brands (brand_name, brand_description) VALUES ('" + req.body.brand_name + "', '" + req.body.brand_description + "')");
  res.redirect('/brand');
});

app.get('/brand', function (req, res) {
  client.query('SELECT * FROM brands')
    .then((data) => {
      console.log('results?', data);
      res.render('brand', { layout: 'submain',
        result: data.rows
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.post('/category/create/saving', function (req, res) {
  console.log(req.body);
  client.query("INSERT INTO products_category (name) VALUES ('" + req.body.name + "')");
  res.redirect('/category');
});

app.get('/category', function (req, res) {
  client.query('SELECT * FROM products_category')
    .then((data) => {
      console.log('results?', data);
      res.render('category', { layout: 'submain',
        result: data.rows
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.post('/addproduct', function (req, res) {
  console.log(req.body);
  client.query("INSERT INTO products (name, description, tagline, price, warranty, brand_id, category_id, image) VALUES ('" + req.body.product_name + "', '" + req.body.product_description + "', '" + req.body.product_tagline + "', '" + req.body.product_price + "', '" + req.body.product_warranty + "', '" + req.body.product_brand + "', '" + req.body.product_category + "','" + req.body.product_image + "')");
  res.redirect('/products');
});

app.get('/product/create', function (req, res) {
  var category = [];
  var brand = [];
  var both = [];
  client.query('SELECT * FROM brands')
    .then((result) => {
      brand = result.rows;
      console.log('brand:', brand);
      both.push(brand);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
  client.query('SELECT * FROM products_category')
    .then((result) => {
      category = result.rows;
      both.push(category);
      console.log(category);
      console.log(both);
      res.render('add-product', { layout: 'submain',
        rows: both
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/admins', function (req, res) {
  res.render('admins', { layout: 'submain' });
});

// Server
app.listen(app.get('port'), function () {
  console.log('Server started at port 3000');
});
