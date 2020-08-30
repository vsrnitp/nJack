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



router.post('/selflogin',(req,res)=>{
    // we have implemented login using email only
    const email = req.body.email;
    const password = req.body.password;

    adminRegistrationModel.findOne({'email':email},(err,user)=>{
        if(err) return err;
        else{
            if(!user){
                res.status(404).send('User not found....');
            }
            else{
                bcrypt.compare(password,user.password,(err,valid)=>{
                   // console.log(valid)
                   
                    if(err) res.send(err);
                    else{
                        if(valid){
                           
                            var token = jwt.sign(user._id.toHexString(),'supersecret');
                            res.cookie('adminLoginToken',token)
                            res.status(200).send('cookie set with token '+token+' authenticated!!!..');   
                        }
                        else{
                            res.send('Eroor in your password...')
                        }
                    }
                })
            }
        }
    })
})

module.exports = router;