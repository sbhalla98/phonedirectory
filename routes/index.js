var express = require('express');
var router = express.Router();

/* require modules */
var userModel = require("../modules/contactdetails");
var userobj = userModel.find({});


/* GET home page. */
router.get('/index', function(req, res, next) {
  userobj.exec().then(data=>{
    res.render('index',{title:'MyPhoneBook',records:data })
  }).catch(err=>{
    res.send('Something went wrong try again');
  })
}); 

router.get('/get', function(req, res, next) {
  res.render('editcontact', { title: 'MyPhoneBook' });
});


router.post("/",function(req,res,next){
  var userFirstname  =  req.body.firstname;
  var userlastname = req.body.lastname;
  var useremail = req.body.email;
  var userdate = req.body.date;
  var usermobile = req.body.mobile;


  var user = new userModel({
      firstname:userFirstname,
      lastname:userlastname,
      email:useremail,
      date:userdate,
      mobile:usermobile
  })
  user.save().then(data=>{
      res.render('index',{title:'MyPhoneBook' })
  }).catch(err=>{
      res.send('Something went wrong try again');
  })
  
})


module.exports = router;
