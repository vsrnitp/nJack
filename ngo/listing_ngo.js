const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



// setting up the middlewares
router.use(cookieParser());
router.use(bodyParser.json());

//bringing the model of ngo_data_schema and admn data schema
const {adminRegistrationModel} = require('../database_schema/admin_registration_schema');
const {ngoDataModel} = require('../database_schema/ngoDataSchema');

router.post('/new/ngo',(req,res)=>{
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
                        const ngo = new ngoDataModel({
                            ngoname:req.body.ngoname,
                            ngonumber:req.body.ngonumber,
                            ngodetails:req.body.ngodetails,
                            ngoimg:req.body.ngoimg
                        })
                    
                        if(ngo.ngonumber.toString()===user.ngoid.toString())
                        {
                            ngoDataModel.findOne({"ngonumber":ngo.ngonumber},(err,ngodata)=>{
                                if(err) return err;
                                else{
                                    if(ngodata){
                                        res.status(401).send('Data is already flooded...Not allowed!.');
                                    }
                                    else{
                                        // saving ngo data to the database
                                 ngo.save((err,doc)=>{
                                 if(err) res.status(400).send(err);
                                    else{
                              // completet data here
                                 res.status(200).send(doc);
                             }
                               })

                                    }
                                }
                            })
                           
                        }
                        else{
                            res.status(401).send('Unauthorized!..');
                        }
                        
                    }
                }
            })
        }
    })
})



module.exports = router;
