const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');



// setting up the middlewares
router.use(cookieParser());
router.use(bodyParser.json());


//bringing the registration model of admin
const {adminRegistrationModel} = require('../database_schema/admin_registration_schema');



router.post('/sure',(req,res)=>{
   const token = req.cookies.adminLoginToken;
   jwt.verify(token,'supersecret',(err,decode)=>{
    if(err){
        res.status(401).send('Unauthorized!')
    }
    /*else if(token === undefined){
        res.status(404).send('already logged out..')
    }*/
    else{
        adminRegistrationModel.findOne({"_id":decode},(err,user)=>{
            if(err) return err;
            else{
                if(!user){
                    res.status(404).send('login first');
                }
                else{
                    res.clearCookie('adminLoginToken', { path: '/' }).send('successFully logged out!');
                }
            }
        })
       // res.send(decode);
    }
})
});


module.exports = router;