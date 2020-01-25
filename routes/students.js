var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoClient = require('mongodb').MongoClient,
assert = require('assert');
var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');
var csvtojson = require('csvtojson');
var csv = require('fast-csv');
var fs = require('fs'); 
var parse = require('csv-parse');


var studentdetails = require('../models/studentdetails');

//var url = "mongodb://127.0.0.1:27017/";

function validate(jsonObj){
    var jobj = jsonObj;
    jobj = jsonObj[0];
    console.log(Object.keys(jobj).length);
    if(Object.keys(jobj).length!= 11)
        return 0;
    var keys = ["CODE","ADMN NO","CLASS","NAME OF THE STUDENT","NAME OF THE FATHER","DOOR NO","STREET","TOWN","PHONE 1","PHONE 2","EMAIL ID"];
    for(var i in jobj){
        var count=0;
        for(var j=0;j<keys.length;j++)
            if(i==keys[j]){
                count+=1;
            }
        if(count==0)
            return 0;
    }
    return 1;
}


const url = 'mongodb://venky:venky123@ds161391.mlab.com:61391/sasi_bill_app';

router.get('/studentdetails',function(req,res){
	res.render('studentdetails');
});

router.post('/studentdetails',function(req,res){

    console.log("in post method student details");

    const csvFilePath= req.body.studentfile
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    //console.log(jsonObj);

    var valid = validate(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
 if(valid == 1){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("loginapp");
        
        dbo.collection("studentdetails").insertMany(jsonObj, function(err, res) {
          if (err) throw err;
          console.log("Number of documents inserted: " + res.insertedCount);
          db.close();
        });
      });}
      else{
          console.log('not valid');
      }
})


 
// Async / await usage
//const jsonArray=await csv().fromFile(csvFilePath);
    

    

    res.redirect('/');
    
    
    

});







  
    
    




module.exports = router;