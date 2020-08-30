const mongoose = require('mongoose');
const adminLedgerDepositeSchema = mongoose.Schema({
    
    username:{
    type:String,
    required:true,
    unique:false
    }
    ,
   amount:{
   type:Number,
   required:true,
   unique:false
   },
   depositor:{
    type:String,
    required:true
},
   date:{
       type:Date,
       default:Date.now()
   }
   })
   
   const adminLedgerDepositeModel= mongoose.model('adminLedgerDepositeModel',adminLedgerDepositeSchema );
    
    
    module.exports = { adminLedgerDepositeModel }