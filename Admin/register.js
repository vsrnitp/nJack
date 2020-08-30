const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jsonwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const saltRounds = 10;


// setting up the middlewares
router.use(cookieParser());
router.use(bodyParser.json());


//bringing the registration model of admin
const {adminRegistrationModel} = require('../database_schema/admin_registration_schema');


//setting up the route
//register route
//PUBLIC ROUTE

router.post('/register',(req,res)=>{
    const admin = new adminRegistrationModel({
        username:req.body.username,
        email:req.body.email,
        address:req.body.address,
        mobileno:req.body.mobileno,
        password:req.body.password,
        ngoname:req.body.ngoname,
        ngoid:req.body.ngono,
        apikey:req.body.apikey,
        authkey:req.body.authkey
    })
    //if the admin doesnt provide API Keys then by default my api will be used
    if(admin.apikey === undefined && admin.authkey === undefined){
        admin.apikey = 'test_9a5f2b784f71e2a7fbce551c821';
        admin.authkey = 'test_4a1aac88f06e9587b2d4b702a92';
    }
    //console.log(admin);

   // hashing the password before saving to database
   bcrypt.hash(admin.password,saltRounds,(err,hash)=>{
       if(err) throw err;
       else{
           admin.password = hash;
           
           // saving admin data to the database
           admin.save((err,doc)=>{
               if(err) res.status(400).send(err);
               else{
                   // completet data here
                   res.status(200).send(doc);
               }
           })

       }
   })
    

})







// exporting the router
module.exports = router;