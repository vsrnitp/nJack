const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');



// setting up the middlewares
router.use(cookieParser());
router.use(bodyParser.json());


//bringing the registration model of donor
const {donorRegistrationModel} = require('../database_schema/donor_registration_schema');


router.post('/donor',(req,res)=>{
   const token = req.cookies.donorLoginToken;
   jwt.verify(token,'supersecret',(err,decode)=>{
    if(err){
        res.status(401).send('Unauthorized!')
    }
    /*else if(token === undefined){
        res.status(404).send('already logged out..')
    }*/
    else{
        donorRegistrationModel.findOne({"_id":decode},(err,user)=>{
            if(err) return err;
            else{
                if(!user){
                    res.status(404).send('login first');
                }
                else{
                    res.clearCookie('donorLoginToken', { path: '/' }).send('successFully logged out!');
                }
            }
        })
       // res.send(decode);
    }
})
});


module.exports = router;