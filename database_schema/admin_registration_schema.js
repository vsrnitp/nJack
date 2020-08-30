const mongoose = require('mongoose');

const adminRegSchema = mongoose.Schema({
    username:{
    type:String,
    required:true,
    trim:true,
    unique:1
    },
    email:{
    type:String,
    required : true,
    trim:true,
    unique:1
    },
    address:{
    type:String,
    reqired:true,
   
    
    },
    mobileno:{
    type:Number,
    required:true,
    trim:true,
   
    },
    password:{
    type:String,
    required:true,
    minlength:6,    
    },
    ngoname:{
    type:String,
    required:true,
    trim:false,
    
    },
    ngoid:{
    type:Number,
    required:true,
    trim:true,
    unique:1
    },
    apikey:{
    type:String,
    required:false,
    
    },
    authkey:{
    type:String,
    required:false,
    
    }
    })
    const adminRegistrationModel= mongoose.model('adminRegistrationModel',adminRegSchema);
    
    
    module.exports = { adminRegistrationModel }
    