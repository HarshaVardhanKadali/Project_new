var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var csvtojson = require('csvtojson');



var User = require('../models/feedetails');

//var url = "mongodb://127.0.0.1:27017/";
var url = "mongodb://venky:venky123@ds161391.mlab.com:61391/sasi_bill_app";




router.get('/feedetails',function(req,res){
	res.render('feedetails');
});

router.post('/feedetails',function(req,res){

    const csvFilePath= req.body.studentfile
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("loginapp");
        
        dbo.collection("feedetails").insertMany(jsonObj, function(err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res.insertedCount);
          db.close();
        });
      });
})


 
// Async / await usage
//const jsonArray=await csv().fromFile(csvFilePath);
    

    

    res.redirect('/');

});



module.exports = router;