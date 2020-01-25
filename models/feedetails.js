var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var feeSchema = mongoose.Schema({
    class : {
        type : Number
    },
    admnfee:{
        type : Number
    },
    booksfee :{
        type : Number
    },
    tutionfee : {
        type : Number
    },
    
});

var feedetails  = module.exports = mongoose.model('feedetails', feeSchema);