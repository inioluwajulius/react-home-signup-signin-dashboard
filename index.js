const { request, response } = require('express')
const express = require('express');
const app = express()
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
let userschema = {
    firstname: {type:String,required:true},
    lastname: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
}
const URI = 'mongodb+srv://inioluwajulius2007:inioluwaoladejo@cluster0.uq2hdpp.mongodb.net/inioluwaoladejo?retryWrites=true&w=majority'
mongoose.connect(URI)
.then((response)=>{
    console.log("Have connected with mongoose");
    console.log(response);
})
.catch((err)=>{
    console.log(err);
})
let userModel = mongoose.model('loggers_collection',userschema)
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.get("/Homepage",(req,res)=>{
    res.render("home")
})
app.get("/signup",(req,res)=>{
    console.log(req.body);
    res.render("signup", {message:""})
})
app.get("/signin",(req,res)=>{
    console.log(req.body);
    res.render("signin", {message:""})
})
app.post("/signup",(req,res)=>{
    // console.log(req.body);
    let form = new userModel(req.body)
    form.save()
    .then((response)=>{
        console.log(response);
        console.log("have saved to data base");
        res.redirect("signin")
    })
    .catch((err)=>{
        console.log(err);
        if (err.code === 11000) {
            console.log(err.code);
            res.render("signup",{message:"Email already exist"})
        }else {
            res.render("signup",{message:"Please fill in your details"})
        }
    })
})
app.post("/signin",(req,res)=>{
    userModel.find({email:req.body.email,password:req.body.password})
    .then((response)=>{
        console.log(response);
        if (response.length > 0) {
            res.redirect("dashboard")
        } else {
            res.render("signin", {message: "Incorrect Email or Password"})
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post("/delete",(req,res)=>{
    userModel.findOneAndDelete({email:req.body.userEmail})
    .then((response)=>{
        console.log(response);
        res.redirect("dashboard")
        console.log("deleted successfully");
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.get("/dashboard",(req,res)=>{
    userModel.find()
    .then((response)=>{
        console.log(response);
        res.render("dashboard",{userDetails: response})
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post("/edit",(req,res)=>{
    userModel.findOne({email:req.body.userEmail})
    .then((response)=>{
        console.log(response);
        res.render("editUser", {userDetails: response})
    })
})
app.post("/update",(req,res)=>{
    let id = req.body.id
    userModel.findByIdAndUpdate(id, req.body)
    .then((response)=>{
        console.log(response);
        res.redirect("dashboard")
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.listen(5500,()=>{
    console.log("My server as start");
})