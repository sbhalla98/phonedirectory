var express = require('express');
var router = express.Router();

/*to validate things*/
const bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
const {matchedData,sanitize}=require("express-validator");


var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});
/* require modules */
var userModel = require("../modules/contactdetails");
var userobj = userModel.find({});


/* GET home page. */

router.get('/autocomplete/', function(req, res, next) {
  console.log("we are here");
    var regex= new RegExp(req.query["term"],'i');
   
    var userFilter =userModel.find({firstname:regex},{'firstname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    userFilter.exec(function(err,data){
  
      
  var result=[];
  if(!err){
    console.log(data);
     if(data && data.length && data.length>0){
       data.forEach(user=>{
         let obj={
           id:user._id,
           label: user.firstname
         };
         result.push(obj);
       });
  
     }
   
     res.jsonp(result);
  }
  
    });
  
  });


router.get("/add", function(req, res, next) {
  res.render('addcontact', { title: 'MyPhoneBook',error:'' });
});


router.post("/add",urlencodedParser,[check('email','Please Enter valid Email Address').isEmail(),
check('phone',"phone number is not correct").isMobilePhone(),check('firstname').trim().custom((value,{req})=>{
  if(value==''){
      throw new Error('Firstname can not be empty');
  }
  return true;
})],
function(req,res,next){
  const errors = validationResult(req);
    if(!errors.isEmpty()){
    res.render('addcontact',{title:'AddContact',error:errors.mapped()});
    return;
    }


  var userFirstname  =  req.body.firstname;
  var userlastname = req.body.lastname;
  var useremail = req.body.email;
  var userdate = req.body.date;
  var usermobile = req.body.phone;
  console.log(req.body.email);
  var user = new userModel({
      firstname:userFirstname,
      lastname:userlastname,
      email:useremail,
      date:userdate,
      mobile:usermobile
  })
  user.save().then(data=>{
      res.redirect("/");
  }).catch(err=>{
      res.send('Something went wrong try again');
  })
  
})

router.get('/:page?', function(req, res, next) {
  var perPage = 4;
    var page = req.params.page || 1;
  userModel.find({}).sort({firstname:1})
           .skip((perPage * page) - perPage)
           .limit(perPage).exec(function(err,data){
                if(err) throw err;
          userModel.countDocuments({}).exec((err,count)=>{          
  res.render('index', { title:'MyPhoneBook',records: data,
  current: page,
  pages: Math.ceil(count / perPage),message:'' });
  
});
  });
  
});


router.get('/delete/:id',function(req,res,next){
  var id=req.params.id;
    var  filter = userModel.findByIdAndDelete(id);
    filter.exec(function(err,data){
    if(err){
      throw err;
    }
    var string="deleted sucessfiully!!";
    res.redirect("/");
    });
});


router.get('/edit/:id',function(req,res,next){
  var id=req.params.id;
    var  filter = userModel.findById(id);
    filter.exec(function(err,data){
    if(err){
      throw err;
    } 
    res.render('editcontact', { title: 'MyPhoneBook' ,records:data});
    });
});

router.post('/update',function(req,res,next){
  var id=req.body.id;

  var userFirstname  =  req.body.firstname;
  var userlastname = req.body.lastname;
  var useremail = req.body.email;
  var userdate = req.body.date;
  var usermobile = req.body.phone;
  console.log(userdate,req.body.date);
    var  update = userModel.findByIdAndUpdate(id,{
      firstname:userFirstname,
      lastname:userlastname,
      email:useremail,
      date:userdate,
      mobile:usermobile
    });
    update.exec(function(err,data){
    if(err){
      throw err;
    }
    var string="Updated sucessfiully!!";
    res.redirect("/");
    });
});


module.exports = router;


