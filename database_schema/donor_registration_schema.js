const mongoose = require('mongoose');

const donorRegSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    address:{
        type:String,
        required:true,
        
    },
    mobileno:{
        type:Number,
        required:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
})

const donorRegistrationModel = mongoose.model('donorRegistrationModel',donorRegSchema);

module.exports = {donorRegistrationModel}