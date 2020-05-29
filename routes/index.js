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
    var regex= new RegExp(req.query["term"],'i');
   
    var userFilter =userModel.find({firstname:regex},{'firstname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    userFilter.exec(function(err,data){
    var result=[];
    if(!err){
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
  res.render('addcontact', { title: 'MyPhoneBook',error:'',user:'',errors:'' });
});


router.post("/add",urlencodedParser,[check('phone','Phone number is not correct').isMobilePhone(),check('date','Date of birth should be added').notEmpty(),check('lastname','Lastname cannot be empty').trim().notEmpty(),check('firstname','Firstname cannot be empty').trim().notEmpty(),check('phone').custom((value,{req})=>{
  var reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
  if(typeof(value)=='object'){
  value.forEach(function(item){
    if(item.length!=10 || !reg.exec(item)){
      throw Error("Phone number are not correct");
    }
  })
  }
  return true;
  }),check('email').custom((value,{req})=>{
    var reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; 
    
    if(typeof(value)=='string'){
      if(!reg.exec(value)){
        throw Error("Email is not correct");
      }
    }
    else if(typeof(value)=='object'){
    value.forEach(function(item){
      if(!reg.exec(item)){
        throw Error("Email are not correct");
      }
    })
    }
    return true;
    }),check('date').custom((value,{req})=>{
      var dateReg =  /^((19|20)\d{2})\-(0[1-9]|1[0-2])\-(0[1-9]|1\d|2\d|3[01])$/;
      if(!dateReg.exec(value)){
        throw Error('Date is not in proper format');
      }
      return true
    })],
  function(req,res,next){
  const errors = validationResult(req);
    if(!errors.isEmpty()){
    const user = matchedData(req);
    res.render('addcontact',{title:'AddContact',user:user,error:errors.mapped(),errors:''});
    return;
  }
  var userFirstname  =  req.body.firstname;
  var userlastname = req.body.lastname;
  var useremail = req.body.email;
  var userdate = new Date(req.body.date);
  var usermobile = req.body.phone;
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
    res.render('addcontact',{title:'AddContact',user:'',errors:err,error:''});
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


