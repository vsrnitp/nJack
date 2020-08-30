const mongoose = require('mongoose');

const ngoDataSchema = mongoose.Schema({
    ngoname:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    ngonumber:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    ngodetails:{
        type:String,
        required:true,
        trim:true,
    },
    ngoimg:{
        type:String
    }
})

const ngoDataModel = mongoose.model('ngoDataModel',ngoDataSchema);

module.exports = {ngoDataModel}