const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname+"\\date.js");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

var items = ["Buy Food","Cook Food","Eat Food"];
var workItems = [];

app.get("/",function(req,res){

    res.render("list",{listTitle: day.getDate(), newListItems: items});
});

app.post("/",(req,res)=>{
    let item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work",(req,res)=>{
    res.render("list",{listTitle: "Work List", newListItems: workItems});
});

app.listen(3000,function(){
    console.log("Server started running on port 3000");
});