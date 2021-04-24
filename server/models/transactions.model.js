const mongoose = require('mongoose');
var validator = require('validator');

const transactionsSchema = mongoose.Schema({
    passportId: {
        type: Number,
        required: true,
        unique: false,
        min:0
    },
    transactionType: {
        type: String,
        required: true,
        unique: false  
    },
    toId: {
        type: Number,
        require:false
    },
    amount:{
        type:Number,
        required:true,
        unique:false,
        min:0
    },
    date: {
        type: Date,
        required: false,
        unique: false,
        default : Date.now()
    }
})

const transactionsmodel  = mongoose.model('transactions',transactionsSchema);
module.exports= transactionsmodel;
// module.exports = mongoose.model('rooms',roomSchema);
