var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');
var admin = require("firebase-admin");
var firebase = require("firebase");
var Window = require('window');
const window = new Window();

var firebaseConfig = {
    apiKey: "AIzaSyCPf1YwwaluY2vjB4eaaSsTtUQkwyv7Bkk",
    authDomain: "workers-management-system.firebaseapp.com",
    databaseURL: "https://workers-management-system.firebaseio.com",
    projectId: "workers-management-system",
    storageBucket: "workers-management-system.appspot.com",
    messagingSenderId: "329755929588",
    appId: "1:329755929588:web:c520d8dec57e91821827a1",
    measurementId: "G-0M792FS0DB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



// Fetch the service account key JSON file contents
var serviceAccount = require("../workers-management-system-firebase-adminsdk-59043-97ade85ad6.json");

// // Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://workers-management-system.firebaseio.com"
});

// window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

var db = admin.firestore();

var app = express();
var viewemployee = require('../views/viewemployee')


var User = require('../models/user');
var role;

this.rolepub = role;

//var url = "mongodb://127.0.0.1:27017/";
var url = "mongodb://venky:venky123@ds161391.mlab.com:61391/sasi_bill_app";



// Register
//router.get('/register', function (req, res) {
//	res.render('register')

//});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

//GET user signup
router.get('/usignup', function (req, res) {
	res.render('signup');
});

//POST user signup
router.post('/usignup',function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var phn = parseInt(req.body.phn);
	var cphn = parseInt(req.body.cphn);
	var addr = req.body.addr;
	var city = req.body.city;
	var ref = db.collection("USERS").doc(name);
	ref.set(
		{
			"name": name,
			"email": email,
			"phone" : phn,
			"address":addr,
			"city":city
	  	},
	);
	res.redirect('/');
});

//POST Worker signup
router.post('/wsignup',function(req,res){
	var name = req.body.name;
	// var email = req.body.email;
	var phn = parseInt(req.body.phn);
	var cphn = parseInt(req.body.cphn);
	var profession = req.body.profession;
	var city = req.body.city;
	var addr = req.body.addr;
	var ref = db.collection("WORKERS").doc(name);
	ref.set(
		{
			"name": name,
			"phone" : phn,
			"profession":profession,
			"city":city,
			"address":addr
	  	},
	);
	res.redirect('/');
});

// //POST OTP
// firebase.auth().onAuthStateChanged(function(user) {
// 	if (user) {
// 	  console.log("USER LOGGED IN");
	  
// 	} else {
// 	  // No user is signed in.
// 	  console.log("USER NOT LOGGED IN");
// 	}
//   });
// router.post('/login',function(req,res){
// 	var phn = req.body.phn;
// 	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//         "recaptcha-container",
//         {
//           size: "normal",
//           callback: function(response) {
//             submitPhoneNumberAuth();
//           }
//         }
// 	  );
// 	console.log("post otp")
	 
//         var phoneNumber = phn;
//         var appVerifier = window.recaptchaVerifier;
//         firebase
//           .auth()
//           .signInWithPhoneNumber(phoneNumber, appVerifier)
//           .then(function(confirmationResult) {
//             window.confirmationResult = confirmationResult;
//           })
//           .catch(function(error) {
//             console.log(error);
//           });
      
	
	
// 	// res.redirect('/');
// });

//GET worker signup
router.get('/wsignup', function (req, res) {
	res.render('wsignup');
});

//change password

router.get('/changepass',function(req,res){
	res.render('changepass');
});

router.get('/index',function(req,res){
	res.render('index');
});


router.get('/employeedetails',function(req,res){
	res.render('employeedetails');
});

router.get('/viewemployee',function(req,res){
	res.render('viewemployee' , {employee : []});
});
//Change password db

router.get('/deleteemployee',function(req,res){
	res.render('deleteemployee');
});
router.post('/changepass' , function(req,res){
	var username = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;

	

	var passwordhash = bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(password1, salt, function(err, hash) {
			passwordhash = hash;
		});
	});
	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		var dbo = db.db("loginapp");
  		var myquery = { username: req.body.username };
  		var newvalues = { $set: {password : passwordhash } };
  		dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
    		if (err) throw err;
    		console.log("1 document updated");
    		db.close();
  		});
	});
	req.flash('success_msg','password changed sucessfully login to continue');
	res.redirect('/users/login');
	
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var phone = req.body.phone;
	var roleid = req.body.roleid;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('employeedetails', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						
						phone: phone,
						roleid:roleid
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'Employee is added');
					res.redirect('/');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/viewempolyee',function(req,res){
	
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("loginapp");
		var emp = dbo.collection('users').find({username: req.body.username}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			db.close();
		
		 res.render('viewemployee', {employee : result});
			});
			
		
	});
	
});
router.post('/deleteemployee',function(req,res){
	MongoClient.connect(url,function(err,db){
		if(err) throw err;
		var dbo = db.db("loginapp");
		var emp = dbo.collection('users').deleteOne({username : req.body.username});
		res.redirect('/deleteemployee');
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		this.req = req

		console.log(this.req)
		
		//res.redirect('/');
	
});

router.get('/logout', function (req, res) {
	req.logout();
	
	
  
	
	req.session.destroy(function(err) {
	  if(err) {
		console.log(err);
	  } else {
		res.redirect('/users/login');
	  }
  
  });
  
  });

module.exports = router;
module.exports.role = this.rolepub ;


