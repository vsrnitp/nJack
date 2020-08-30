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
const {cashVaultModel} =require('../database_schema/cashVault_schema');
const {adminLedgerWithdrawModel} = require('../database_schema/admin_ledger_withdraw');
const {adminLedgerDepositeModel} = require('../database_schema/admin_ledger_deposite');
const {paymentModel} = require('../database_schema/payment_schema');

// private route for knowing net balance
router.post('/netbalance',(req,res)=>{
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
                        
                       cashVaultModel.findOne({ngoid:user.ngoid},(err,data)=>{
                           if(err) return err;
                           else{
                               res.status(200).send(data);
                           }
                       })
                        
                    }
                }
            })
        }
    })
})


router.post('/withdraw',(req,res)=>{
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
                        // request made from body...
                        const dec_val = req.body.withdraw_amount;
                       cashVaultModel.findOneAndUpdate({ngoid:user.ngoid},{$inc:{ngobalance:-dec_val}},(err,data)=>{
                           if(err) return err;
                           
                           else{
                               if(data.ngobalance-dec_val<0){
                                //console.log('data cant be withdrawn...');
                                cashVaultModel.findOneAndUpdate({ngoid:user.ngoid},{$inc:{ngobalance:dec_val}},(err,data)=>{
                                    res.send('Insufficient funds....');
                                })
                               }
                               else{
                                const withdraw_fund = new adminLedgerWithdrawModel({
                                    username:user.username,
                                    amount:dec_val
                                    
                                })
                                withdraw_fund.save((err,doc)=>{
                                    if(err) return err;
                                    else{
                                        res.status(200).send(dec_val+' Amount withdrawn successfully......');
                                    }
                                })
                               
                               }
                           }
                       })
                        
                    }
                }
            })
        }
    })
})

// private route for admin to deposite money at their cash vault...
router.post('/deposit',(req,res)=>{
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
                        const inc_val = req.body.deposit_amount;
                        cashVaultModel.findOneAndUpdate({ngoid:user.ngoid},{$inc:{ngobalance:inc_val}},(err,data)=>{
                        if(err) return err;
                        else{
                           // console.log(data);
                           const deposite_fund = new adminLedgerDepositeModel({
                            username:user.username,
                            amount:inc_val,
                            depositor:'admin '+req.body.depositor_donor
                        })
                        deposite_fund.save((err,doc)=>{
                            if(err) return err;
                            else{
                                const deposit_user = new paymentModel({
                                    username:req.body.depositor_donor,
                                    secretid:req.body.secretid,
                                    ngonumber:user.ngoid,
                                    month:req.body.month,
                                    amount:inc_val
                                })
                                deposit_user.save();
                                res.status(200).send('successfully deposited '+inc_val+' to '+user.ngoname);
                            }
                        })
                           
                        }
                        })
                        
                    }
                }
            })
        }
    })
})

router.get('/cashoutflow',(req,res)=>{
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
                       adminLedgerWithdrawModel.find({username:user.username},(err,data)=>{
                          if(err) return err;
                          else{
                            res.status(200).send(data);
                          }
                       })
                    }
                }
            })
        }
    })
})

router.get('/cashinflow',(req,res)=>{
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
                       adminLedgerDepositeModel.find({username:user.username},(err,data)=>{
                          if(err) return err;
                          else{
                            res.status(200).send(data);
                          }
                       })
                    }
                }
            })
        }
    })
})

module.exports = router;