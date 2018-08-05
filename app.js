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

	database: 'ddg20o9dscg5ko',
	user: 'tjjqwzraqeurrw',
	password: '14b1e75008e83ca942fa882570e75a5984df1b52a780e4673722b3b85b475966',
	host: 'ec2-23-23-247-222.compute-1.amazonaws.com',
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
app.use(express.static(path.join(__dirname, 'static1')));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.render('home',{

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
			res.render('products',{
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