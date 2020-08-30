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
const {ngoDataModel} =require('../database_schema/ngoDataSchema');

//priate route for profile dashbord of admin
router.post('/dashbord',(req,res)=>{
   const token = req.cookies.adminLoginToken;
   jwt.verify(token,'supersecret',(err,decode)=>{
       if(err){
           res.status(401).send('Unauthorized!..');
       }
       else{
           adminRegistrationModel.findOne({"_id":decode},(err,user)=>{
               if(err) return err;
               else{
                   if(!user){
                       res.status(404).send('Login first....');
                   }
                   else{
                       
                       ngoDataModel.findOne({ngonumber:user.ngoid},(err,data)=>{
                         if(err) return err;
                         else{
                            res.status(200).send('welcome to your profile '+user+' details about your ngo ->'+data);
                         }  
                       })
                       
                   }
               }
           })
       }
   })
})

module.exports = router;