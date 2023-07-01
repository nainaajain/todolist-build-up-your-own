//here is the working solution to lesson 318 for 2023 mongoose/mongoDB
//please upvote if this worked for you!
//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
 
 
 
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
 
const itemsSchema = new mongoose.Schema({
  name: String,
});
 
const Item = mongoose.model("Item", itemsSchema);
 
const item1 = new Item({
  name: "Welcome to your todolist!"
});
 
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
 
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
 
const defaultItems = [item1, item2, item3];
 
 
 
 
 
app.get("/", function(req, res) {
 
  //res.render("list", {listTitle: "Today", newListItems: foundItems})
 
  Item.find({})
    .then(foundItems => {
 
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems).then(function () {
          console.log("Successfully saved default items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
 
    })
    .catch(err => {
      console.error(err);
    });
 
});
 
app.post("/", function(req, res){
 
  const item = req.body.newItem;
 
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});
 
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});
 
app.get("/about", function(req, res){
  res.render("about");
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});