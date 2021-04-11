const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todos = require('./models/db');
const ejs = require('ejs');
const { findOneAndRemove } = require('./models/db');

var todos = []; // initialize object for storing a data from our database
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/todoapp', {useNewUrlParser: true}, err =>{
    if(err){
        console.log('Attempt to connect to DB failed: '+ err);
    }else{
        console.log('A successfull connection to MongoDB!');
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    Todos.find((err, doc)=>{
        if(err){
            console.log('Error in retrieving docs: '+ err);
        }else{
            res.render('home', {
                todos: doc,
                todoItem: {
                    itemName: '',
                    itemCategory: ''
                },
                ACTION: '/insertItem'
            });
            todos = doc;
        }
    }).lean();
});

app.post('/insertItem', (req,res)=>{
    var todoItem = new Todos({
        itemName: req.body.itemName,
        itemCategory: req.body.itemCategory,
        date: new Date().toLocaleDateString()
    });
    todoItem.save((err, doc)=>{
        if(err){
            console.log(err);
        }else{
            console.log(doc);
            res.redirect('/');
        }
    })
});

app.get('/editItem/:id', (req, res)=>{
    Todos.findOne({_id: req.params.id}, (err, todo)=>{
        if(err){
            console.log(err);
        }else{
            res.render('home',{
                todoItem: todo,
                todos: todos,
                ACTION: `/insertItem/${req.params.id}`
            });
        }
    }).lean();
});

app.post('/insertItem/:id', (req, res)=>{
    Todos.findOneAndUpdate({_id: req.params.id}, req.body, {new: false}, (err,doc)=>{
        if(!err){
            res.redirect('/');
        }else{
            console.log('Error occured during update item: '+ err);        }
    })
});

app.get('/deleteItem/:id', (req, res)=>{
    Todos.findOneAndRemove({_id: req.params.id}, (err, doc)=>{
        if(!err){
            res.redirect('/');
        }else{
            console.log('Error in delete todo item: '+ err);
        }
    })
});

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
})

