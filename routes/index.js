var express = require('express');
var router = express.Router();
var users = require('./users');



// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	console.log(req.user.roleid);
	if(req.user.roleid=="admin"){
		res.render('index');}
	
		if(req.user.roleid!="admin"){
			res.render('index1');}
		
	
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;