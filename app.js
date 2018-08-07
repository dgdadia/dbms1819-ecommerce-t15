const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const client = new Client({
	 // database: 'MyDatabase',
	 // user: 'postgres',
	 // password: 'dadi123',
	 // host: 'localhost',
	 // port: 5432

	database: 'deatjh8dni4e5m',
	user: 'qseerelbxgffyi',
	password: '9b1dd5ea684422c5fe984b94449a90a544b997a33ceaf5ae5eb3c652a70a4fef',
	host: 'ec2-54-83-12-150.compute-1.amazonaws.com',
	port: 5432,
	ssl: true
});

client.connect()
	.then(function(){
		console.log('Connected to database')
	})
	.catch(function(err){
		console.log('Cannot connect to database')
	});

const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.set('port',(process.env.PORT|| 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.render('home',{

	});
});

app.get('/product/add', function(req, res) {
	res.render('add-product',{

	});
});

app.get('/brand/create', function(req, res) {
	res.render('create-brand',{

	});
});

app.get('/category/create', function(req, res) {
	res.render('create-category',{

	});
});

app.post('/brand/create/saving', function(req, res) {
	console.log(req.body)
	client.query("INSERT INTO brands (brand_name, brand_description) VALUES ('" + req.body.brand_name + "', '" + req.body.brand_description + "')");
	res.redirect('/brand');
});

app.get('/brand', function(req, res){
	client.query('SELECT * FROM brands')
	.then((result)=>{
		console.log('results?', result);
		res.render('brand', result);
	})
	.catch((err) => {
		console.log('error', err);
		res.send('Error!');
	});
});

app.post('/category/create/saving', function(req, res) {
	console.log(req.body)
	client.query("INSERT INTO products_category (name) VALUES ('" + req.body.name + "')");
	res.redirect('/category');
});

app.get('/category', function(req, res){
	client.query('SELECT * FROM products_category')
	.then((result)=>{
		console.log('results?', result);
		res.render('category', result);
	})
	.catch((err) => {
		console.log('error', err);
		res.send('Error!');
	});
});


app.get('/form', function(req, res) {
	res.render('form',{

	});
});



	app.get('/member1', function(req, res) {
	res.render('members',{
		name: 'Romar Dizon',
		email: 'romardizon27@gmail.com',
		phone: '09213309976',
		imageurl:'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/15284927_1275474115852962_685390893495489160_n.jpg?_nc_cat=0&_nc_eui2=AeHCALjlEfR9s5Pouq9YJJQDWG3Hy6mo1REBqs48K1kNT0d_tMukn5-RE1iw3NBxkFiMnKYdXQUHQ11RDborwINnmCWWV8GtJipg5gsY73u7iw&oh=681069f3182f2d5961ab81639570f4e8&oe=5BC8995F',
		hobbies: ['Playing Basketball','Playing Badminton','Playing Dota','Watching Movies','Dancing']

	});
});

	app.get('/member2', function(req, res) {
	res.render('members',{
		name: 'Danica Dadia',
		email: 'danicadadia.dd@gmail.com',
		phone: '09297567752',
		imageurl:'https://scontent.fmnl4-4.fna.fbcdn.net/v/t1.0-9/26229420_2164092686964723_3022482758723077958_n.jpg?_nc_cat=0&_nc_eui2=AeHuBXDXg38sC4JhAEnnlFggZE4VngC4GqR8GpT9Mgzaq4_1p8gjo2M23vhAjZ1ctPLULalQ7r0CKnBEFbdY0U5aMz1GRBdp6P-Cjc7himBN9w&oh=cc12724b1e7da212bf7f1e2a379bbfd4&oe=5BFF378E',
		hobbies: ['Watching Movies','Dancing','Makeup']

	});
});

	app.post('/addproduct', function(req, res) {
	console.log(req.body)
	client.query("INSERT INTO products (name, description, tagline, price, warranty, brand_id, category_id, image) VALUES ('" + req.body.product_name + "', '" + req.body.product_description + "', '" + req.body.product_tagline + "', '" + req.body.product_price + "', '" + req.body.product_warranty + "', '" + req.body.product_brand + "', '" + req.body.product_category + "','" + req.body.product_image + "')");
	res.redirect('/products');
});

app.get('/product/create', function(req, res) {
	 var category = []; 
	 var brand = [];
	 var both =[];
	 client.query('SELECT * FROM brands')
	.then((result)=>{
	    brand = result.rows;
	    console.log('brand:',brand);
	    both.push(brand);
	})
	.catch((err) => {       
		console.log('error',err);
		res.send('Error!');
	});
    client.query('SELECT * FROM products_category')
	.then((result)=>{
	    category = result.rows;
	    both.push(category);
	    console.log(category);
	    console.log(both);
		res.render('add-product',{
			rows: both
		});
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});

});





// connect to database
app.get('/products',(req,res)=>{
	
	client.query('SELECT * FROM products;', (req,data)=>{

		var list = [];

		for (var i=0; i< data.rows.length; i++){
			list.push(data.rows[i]);
		}
		res.render('products',{
			data: list,
			title: 'My Makeup World'
		});
	});
});

app.get('/products/:id', (req,res)=>{
	var id = req.params.id;
	client.query('SELECT * FROM products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length+1; i++) {
			if (i==id) {
				list.push(data.rows[i-1]);
			}
		}
		res.render('product-details',{
			data: list
		});
	});
});

	// .then((results)=>{
	// 	console.log('results[2]', results);
	// 	res.render('products', results);

	// })
	// .catch((err)=>{
	// 	console.log('error', err);
	// 	res.send('Error!');
	// });
// });



app.post('/products/:id/send', function(req, res) {
	console.log(req.body);
	var id = req.params.id;
	const output = `
		<p>You have a new contact request</p>
		<h3>Contact Details</h3>
		<ul>
			<li>Customer Name: ${req.body.name}</li>
			<li>Phone: ${req.body.phone}</li>
			<li>Email: ${req.body.email}</li>
			<li>Product ID: ${req.body.productid}</li>
			<li>Quantity ${req.body.quantity}</li>
		</ul>
	`;

	//nodemailer
	let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'dbmsteam15@gmail.com', 
            pass: 'team15@dbms' 
        }
    });

    let mailOptions = {
        from: '"Makeup Mailer" <dbmsteam15@gmail.com>',
        to: 'danicadadia.dd@gmail.com, romardizon27@gmail.com',
        subject: 'My Makeup World Order Request',
        //text: req.body.name,
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        client.query('SELECT * FROM products', (req, data)=>{
			var list = [];
			for (var i = 0; i < data.rows.length+1; i++) {
				if (i==id) {
					list.push(data.rows[i-1]);
				}
			}
			res.render('form',{
				data: list,
				msg: '---Email has been sent---'
			});
		});
     });
});


//Server
app.listen(app.get('port'), function() {
	console.log('Server started at port 3000');
});