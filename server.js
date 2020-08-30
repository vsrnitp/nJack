const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;


// bringing routes from express router
const donorReg = require('./Donor/register');
const donorLogin = require('./Donor/login');
const donorLogout = require('./Donor/logout');
const donorProfile = require('./Donor/profile');
const adminReg = require('./Admin/register');
const adminLogin = require('./Admin/login');
const adminLogout = require('./Admin/logout');
const adminProfile = require('./Admin/profile');
const ngoListing = require('./ngo/listing_ngo');
const donorPayment = require('./Donor/payment');
const netBalance = require('./Admin/netbalance');

// initializing the express app...
const app = express();

//setting ejs as our view engine...
app.set('view engine','ejs');

// grabbing the online connection url of mlab(A cloud database hosting company)
const Connection_URL = 'mongodb://njack:njack12345@ds133256.mlab.com:33256/njack';
//connecting wih database
mongoose.connect(Connection_URL,{ useNewUrlParser: true })
.then(()=>{
    console.log('Database connected....')
})

// bringing body parser and cookie parser
app.use(bodyParser.json());
app.use(cookieParser());

// grabbing various database schemas....
const {ngoDataModel} = require('./database_schema/ngoDataSchema');


// entry point of the site... will flood the site with 10 ngo list per page...
app.get('/',(req,res)=>{
    //res.send('The entry point of the site.....')
    /**********remove this test ejs document******* */
/* @ pagination has not been implemented... will be implemented later*/ 
    ngoDataModel.find()
    .limit(10)
    .then(data=>{
       // console.log(data);
        //const payment_url = `http://localhost:8080/pay/ngo/${data[0].ngonumber}`
        console.log(data);
       // console.log(payment_url);
    })
   
});



// registration route for DONORS...
//PUBLIC ROUTE
app.use('/auth/donor',donorReg);

//login route for DONORS...
//PUBLIC ROUTE
app.use('/auth/donor/login',donorLogin);


//profile dashbord route for DONORS...
//PRIVATE ROUTE
app.use('/auth/profile',donorProfile);

//logout route for DONORS...
//PRIVATE ROUTE
app.use('/auth/logout',donorLogout);

//registration route for ADMINS...
//PUBLIC ROUTE
app.use('/auth/admin',adminReg);

//login route for ADMINS...
//PUBLIC ROUTE
app.use('/auth/admin/login',adminLogin);


//profile dashbord route for ADMINS...
//PRIVATE ROUTE
app.use('/auth/admin/profile',adminProfile);

//logout route for ADMINS...
//PRIVATE ROUTE
app.use('/auth/admin/logout',adminLogout);


// private route to flood the data about NGOs
//PRIVATE ROUTE
app.use('/flood',ngoListing);

//Private route for donors to pay to a particular NGO
//PRIVATE ROUTE
app.use('/pay',donorPayment);

//private route for admin to know the net balance, withraw and deposit amount in the cash vault of their NGO
//PRIVATE ROUTE
app.use('/admin',netBalance);


const PORT = process.env.PORT||8080;

app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}....`);
})