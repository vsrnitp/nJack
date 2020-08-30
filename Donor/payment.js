const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');



// setting up the middlewares
router.use(cookieParser());
router.use(bodyParser.json());




//bringing the registration model of donor and ngo
const {donorRegistrationModel} = require('../database_schema/donor_registration_schema');
const {ngoDataModel} = require('../database_schema/ngoDataSchema');
const {adminRegistrationModel} = require('../database_schema/admin_registration_schema');
const {paymentModel} = require('../database_schema/payment_schema');
const {cashVaultModel} = require('../database_schema/cashVault_schema');
const {adminLedgerDepositeModel} = require('../database_schema/admin_ledger_deposite');


router.post('/ngo/:ngonumber',(req,res)=>{
   
    const ngonumber = req.params.ngonumber;
    
    
    //console.log(ngonumber);
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
                    var payment = new paymentModel({
                        username:user.username,
                        secretid:req.body.secretid,
                        ngonumber:ngonumber,
                        month:req.body.month,
                        amount:req.body.amount
                       })

                 
                   ngoDataModel.findOne({"ngonumber":payment.ngonumber},(err,data)=>{
                       if(err) throw err;
                       else{
                           if(!data){
                               res.status(404).send('NGO doesnt exists..')
                           }
                           else{
                             payment.save((err,doc)=>{
                
                         if(err) res.send('You have paid with this secret id, try another')
                            else{
                            //adding money to respective cash vaults..... 
                            //var realVault;   
                                cashVaultModel.findOneAndUpdate({"ngoid":payment.ngonumber},{$inc:{ngobalance:payment.amount}},(err,vault)=>{
                                   // console.log(vault)
                                    if(err) return err;
                                    else if (vault){
                                      const deposit_amount = new adminLedgerDepositeModel({
                                          username:payment.username,
                                          amount:payment.amount,
                                          depositor:'Donor'
                                      })
                                      deposit_amount.save((err,doc)=>{
                                        if(err) return err;
                                        else{
                                        res.status(200).send(vault)
                                        }
                                      })
                                    
                                     }

                                    else{
                                       const vault = new cashVaultModel({
                                        ngoid:payment.ngonumber,
                                        ngobalance:payment.amount
                                       })
                                       vault.save((err,db)=>{
                                           if(err) return err;
                                           else{
                                            const deposit_amount = new adminLedgerDepositeModel({
                                                username:payment.username,
                                                amount:payment.amount,
                                                depositor:'Donor'
                                            })
                                            deposit_amount.save((err,doc)=>{
                                              if(err) return err;
                                              else{
                                              res.status(200).send(doc)
                                              }
                                            })
                                            //    console.log(db);
                                           }
                                       });
                                    }
                                   // console.log(globalVariable); 
                                })
                             
                              
                             // res.send(doc);
                             }
                              })
                           }
                       }
                   })
                   
      
            //     console.log(payment);
            
                
                }
            }
        })
       // res.send(decode);
    }
})
});




module.exports = router;