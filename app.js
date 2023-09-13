const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://anonymous7189:9618234775Ab@atlascluster.rjsngui.mongodb.net/toDoListDB",{useNewUrlParser : true});

const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name : "Welcome to your ToDoList"
});

const item2 = new Item({
    name : "Hit + button to add new item"
});

const item3 = new Item({
    name : "<-- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name : String,
    items : [itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

    Item.find({})
        .then(function(items){

            if(items.length === 0)
            {
                Item.insertMany(defaultItems);
            }

            res.render("list",{listTitle: "Today", newListItems: items});
        })
        .catch(function(err){
            console.log(err);
        })
});

app.post("/",(req,res)=>{

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name : itemName
    });

    if(listName === "Today")
    {
        item.save();

        res.redirect("/");
    }

    else{
        List.findOne({name : listName})
            .then(function(foundList){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+listName);
            })
            .catch(function(err){
                console.log(err);
            })
    }
    
});

app.post("/delete",function(req,res){

    const checkedId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName==="Today")
    {
        Item.deleteOne({_id : checkedId})
            .then(function(){
                res.redirect("/");
            })
            .catch(function(err){
                console.log(err);
            })
    }
    else {
        List.findOne({name: listName})
            .then(function(result){
                result.items.pull(checkedId);
                result.save();
                res.redirect("/" + listName);
            })
            .catch(function(err){
                console.log(err);
            })
        }
});

app.get("/:customListName",(req,res)=>{
    
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name : customListName})
        .then(function(foundList){
            if(!foundList)
            { 
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });

                list.save();
            }
            res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
        })
        .catch(function(err){
            console.log(err);
        })
});

app.listen(3000,function(){
    console.log("Server started running on port 3000");
});