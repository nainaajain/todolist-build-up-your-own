//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')
.then(function(){
    console.log("succesfully connected");
})
.catch(function(err){
    console.log(err);
});

//Created Schema
const itemsSchema = new mongoose.Schema({
name: String
});

//Created model
const Item = mongoose.model("Item", itemsSchema);

// Creating items
const item1 = new Item({
  name: "Welcome to your todo list."
});

const item2 = new Item({
  name: "Hit + button to create a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

//Storing items into an array
const defaultItems = [item1, item2, item3];

const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
  });
  const List= mongoose.model("list",listsSchema);
  



app.get("/", function(req, res) {
  // mongoose find command for getting items 
  Item.find({}).then(function(foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems)
  .then(function(){
    console.log("Successfully saved into our DB.");
  })
  .catch(function(err){
    console.log(err);
  });

    res.render("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
  })
  .catch(function(err){
    console.log(err);
  });

  

});

app.post("/", function(req, res){

  const itemName = req.body.newitem;
  const listName= req.body.list;
  console.log(itemName);
  console.log(listName);
  const itementry = new   Item({
    name:itemName
  });
  if(listName==="Today"){
    itementry.save(); 
    res.redirect("/");

  }
  else{
    List.findOne({name:listName })
      .then(function(foundList){
      foundList.items.push(itementry);
      foundList.save();
      res.redirect("/" + listName);
    })
    .catch(function(err){
        console.log("error logging in");
    });
  }
});
// deleting the database 
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox ;
  const listName= req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId)
  .then(function(){
    console.log("Successfully removed");
    res.redirect("/");

  })
  .catch(function(err){
    console.log(err);
  })}
  else
  {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
    .then(function(foundList){
      console.log("updated");
      res.redirect("/"+listName);
    })
    .catch(function(err){
      console.log(err);
    });

  }
  
  });


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({name: customListName})
    .then(foundList => {
      if(!foundList){
 
        const list = new List({
          name: customListName,
          items: defaultItems
        });
 
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    })
    .catch((err) => {
      console.log(err);
    });
 
 
});
 

// app.get("/work", function(req,res){
//   

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});