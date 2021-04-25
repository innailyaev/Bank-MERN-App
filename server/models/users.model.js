const mongoose = require('mongoose');
var validator = require('validator');

const usersSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: false  
    },
    passportId: {
        type: Number,
        required: true,
        unique: true,
        min:0
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: false,
        required:false,   
        // validate(value){
        //     if(!(validator.isEmail(value))){
        //         throw new Error ("Email is invalid")
        //     }   
        // } 
    },
    isActive: {
        type: Boolean,
        required: false,
        unique: false,
        default : true
    },
    accountDetails: {
            cash:{
                type: Number,
                required: true,
                unique:false,
                default:0
            },
            
            credit:{
                type: Number,
                required: true,
                unique:false,
                default:0
            },
        },//End details
})

const usersmodel  = mongoose.model('users',usersSchema);
module.exports= usersmodel;
// module.exports = mongoose.model('rooms',roomSchema);
