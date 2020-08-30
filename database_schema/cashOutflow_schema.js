const mongoose = require('mongoose');
const outflowSchema = mongoose.Schema({
    ngoid:{
    type:Number,
    unique:1,
    required:true
    },
    amountdeducted:{
    type:Number,
    unique:1,
    required:true
    },
    timestamb:{
    type:Number,
    unique:1,
    required:true
  
    }})
    const outflowModel= mongoose.model('outflowModel', outflowSchema);
    
    
    module.exports = { outflowModel }