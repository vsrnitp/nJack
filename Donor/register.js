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
router.use(bodyParser.urlencoded({extended:false}));


//bringing the registration model of donor
const {donorRegistrationModel} = require('../database_schema/donor_registration_schema');




// setting up the routes
// register route
//PUBLIC ROUTE
router.post('/register',(req,res)=>{

    const donor = new donorRegistrationModel({
        username:req.body.username,
        email:req.body.email,
        address:req.body.address,
        mobileno:req.body.mobileno,
        password:req.body.password
    })
   // console.log(req.body.username);
   // hashing the password before saving to database
   bcrypt.hash(donor.password,saltRounds,(err,hash)=>{
       if(err) throw err;
       else{
           donor.password = hash;
           
           // saving donor data to the database
           donor.save((err,doc)=>{
               if(err) res.status(400).send(err);
               else{
                   res.status(200).send(doc);
               }
           })

       }
   })
    

})







// exporting the router
module.exports = router;