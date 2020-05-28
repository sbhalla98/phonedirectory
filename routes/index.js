var express = require('express');
var router = express.Router();

/* require modules */
var userModel = require("../modules/contactdetails");
var userobj = userModel.find({});


/* GET home page. */

router.get("/", function(req, res, next) {
  res.render('addcontact', { title: 'MyPhoneBook' });
});


router.post("/",function(req,res,next){
  var userFirstname  =  req.body.firstname;
  var userlastname = req.body.lastname;
  var useremail = req.body.email;
  var userdate = req.body.date;
  var usermobile = req.body.phone;

  var user = new userModel({
      firstname:userFirstname,
      lastname:userlastname,
      email:useremail,
      date:userdate,
      mobile:usermobile
  })
  user.save().then(data=>{
      res.redirect("/index");
  }).catch(err=>{
      res.send('Something went wrong try again');
  })
  
})

router.get('/index/:page?', function(req, res, next) {
  var perPage = 4;
    var page = req.params.page || 1;
  userModel.find({})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
          userModel.countDocuments({}).exec((err,count)=>{          
  res.render('index', { title:'MyPhoneBook',records: data,
  current: page,
  pages: Math.ceil(count / perPage) });
  
});
  });
  
});

// router.get('/index', function(req, res, next) {
//   // var perPage = 1;
//   // var page = req.params.page || 1;
//   // userobj.exec().then(data=>{
//   //   console.log(data);
//   //   res.render('index',{title:'MyPhoneBook',records:data })
//   // }).catch(err=>{
//   //   res.send('Something went wrong try again');
//   // })

//   var perPage = 1;
//   var page = req.params.page || 1;

//         userModel.find({})
//          .skip((perPage * page) - perPage)
//          .limit(perPage).exec(function(err,data){
//               if(err) throw err;
//         userModel.countDocuments({}).exec((err,count)=>{          
//         res.render('index', { title:'MyPhoneBook',records: data,
//         current: page,
//         pages: Math.ceil(count / perPage) });

//         });
//         });
// }); 




module.exports = router;


