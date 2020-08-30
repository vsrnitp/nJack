const mongoose = require('mongoose');
const adminLedgerSchema = mongoose.Schema({
    
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
   
   date:{
       type:Date,
       default:Date.now()
   }
   })
   
   const adminLedgerWithdrawModel= mongoose.model('adminLedgerWithdrawModel',adminLedgerSchema );
    
    
    module.exports = { adminLedgerWithdrawModel }