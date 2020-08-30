const mongoose = require('mongoose');
const cashVaultSchema = mongoose.Schema({
    ngoid:{
    type:Number,
    unique:1,
    required:true
    },
    ngobalance:{
    type:Number,
    required:true
    }})
   const cashVaultModel= mongoose.model('cashVaultModel', cashVaultSchema);
    
    
    module.exports = { cashVaultModel }
    