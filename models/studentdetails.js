var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var studentSchema = mongoose.Schema({
    code : {
        type : Number
    },
    admnno:{
        type : Number
    },
    class :{
        type : String
    },
    name : {
        type : String
    },
    father:{
        type : String
    },
    town : {
        type :String
    },
    phone1 : {
        type : Number
    },
    phone2 :{
        type : Number
    },
    email :{
        type : String
    }

});

var studentdetails  = module.exports = mongoose.model('studentdetails', studentSchema);