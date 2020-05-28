var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/phonebook",{useUnifiedTopology:true,useNewUrlParser:true})
mongoose.set('useFindAndModify', false);
var conn=mongoose.connection;
var userSchema = new mongoose.Schema({
    firstname: {
        type:String,
    },lastname: {
        type:String,
    },email:{
        type:String,
        match:/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },date:{
        type: Date
    },
    mobile:{
        type:String
    }
});


var userModel = mongoose.model('User',userSchema);

conn.on("connected",function(){
    console.log("connected sucessfully");
})

conn.on("disconnected",function(){
    console.log("disconnected sucessfully");
})

conn.on("error",console.error.bind(console,'connection error:'));

module.exports= userModel;