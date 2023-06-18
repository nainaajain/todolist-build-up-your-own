// jshint esversion:6
const express = require("express");
const bodyParser= require("body-parser");
const app= express();
const date=require(__dirname + "/date.js");


let items=["buy the food","make the food","eat the food"];
let workitems=[];

// we created an array of items so after the post request we will push the ellements into it

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){

    let Day=date.getDate();
   
    res.render("list", {listtitle:Day, newlistitems:items});
    // passing the whole array of items when we render 

});
app.post("/",function(req,res){
    let item= req.body.newitem;
    if(req.body.list==="work"){
        workitems.push(item);
        res.redirect("/work");
    }else{
        
    items.push(item);
    res.redirect("/");

    }

    
});
app.get("/work",function(req,res){
    res.render("list",{listtitle:"work list" ,newlistitems:workitems});
});
app.post("/work",function(req,res){
    let item=req.body.newitem;
    workitems.push(items);
    res.redirect("/work");
});
app.listen(3000,function(){
    console.log("server is running at 3000");
});