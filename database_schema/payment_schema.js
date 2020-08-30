const mongoose = require('mongoose');
const donerPaymentSchema = mongoose.Schema({
    /*id:{
    type:String,
    required:true,
    
    },*/
    username:{
    type:String,
    required:true,
    unique:false
    },
    secretid:{
        type:String,
        required:true,
        unique:false
    },
    
    ngonumber:{
    type:String,
    required:true,
    unique:false
    },
   month:{
   type:String,
  required:true
   },
   amount:{
   type:Number,
   required:true,
   unique:false
   }
   })
   
   const paymentModel= mongoose.model('paymentModel', donerPaymentSchema);
    
    
    module.exports = { paymentModel }
    