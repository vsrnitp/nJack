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
const {paymentModel} = require('../database_schema/payment_schema');
const {ngoDataModel} = require('../database_schema/ngoDataSchema');

//priate route for profile dashbord of donors
router.post('/donor',(req,res)=>{
   const token = req.cookies.donorLoginToken;
   jwt.verify(token,'supersecret',(err,decode)=>{
       if(err){
           res.status(401).send('Unauthorized!..');
       }
       else{
           donorRegistrationModel.findOne({"_id":decode},(err,user)=>{
               if(err) return err;
               else{
                   if(!user){
                       res.status(404).send('Login first....');
                   }
                   else{
                    
                       paymentModel.find({"username":user.username},(err,data)=>{
                          // for(var i =0 ;i<data.length;i++)
                        //   console.log(data[i].ngonumber+"->"+data[i].amount)
                        const twist = data;
                        ngoDataModel.find()
                    .limit(10)
                    .then(data=>{
                    // console.log(data);
                    const payment_url = `http://localhost:8080/pay/ngo/${data[0].ngonumber}`
                    
                    res.status(200).send('welcome to your profile '+user+"Data: "+data+"past payments:"+twist);
                         })
                          
                       })

 /* @ pagination has not been implemented... will be implemented later*/ 
                    
                // top donors has not been implemented....         
                      // res.status(200).send('welcome to your profile '+user);
                   }
               }
           })
       }
   })
})

module.exports = router;