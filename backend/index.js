

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const port = 9090;
var users = [];
const async = require('async');
const {ObjectId} = require('mongodb');

const app = express();

app.use(bodyParser.json());

const MongoClient = mongodb.MongoClient;
MongoClient.connect('mongodb://localhost:27017/arkanea', (err, Database) => {
    if(err) {
        console.log(err);
        return false;
    }
    const db = Database.db("arkanea");
    users = db.collection("user");
    console.log("Connected to MongoDB");
    const server = app.listen(port, () => {
        console.log("Server started on port " + port + "...");
    });

});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
        next();
    });

app.get('/users', (req, res) => {
    console.log("inside get users")
    users.find({}).toArray((err, users) => {
        if(err){
            console.log("err in user auth", err);
            res.send(err);
        }
        if(users && users.length){ 
            res.json({ userAvailable: true, users: users });
        } else{
            res.json({userAvailable : false, users : []});

        }
    });
});  

app.post('/user/register', async (req, res, next) => {
    let user = req.body;
	console.log("inside user/register>>>", user);  
    let respUser = await users.find({email : user.email}).toArray();
    if(respUser && respUser.length){
        console.log('respUser if',respUser)
        res.json({ email_exists: true, user : {}, added:false });
    } else {
        console.log('respUser else',respUser)
        let insertedUser = await users.insertOne(user)
            if(insertedUser){
                res.json({email_exists : false, user: insertedUser, added: true});
            }
    }
    
});

app.post('/user/update', async (req, res) => {
    let user = req.body;
    let id = new ObjectId(user._id);
    console.log('inside user/updated',id);
    delete user._id;
    let respUser = await users.updateOne( { _id : id}, { $set: user })
    console.log('respUser',respUser)
    if(respUser && respUser.result && respUser.result.nModified){
        res.json({ updated:true, updatedData : user});
    } else {
        res.json({ updated:false, updatedData : {}});
    }
});

app.delete('/user/delete/:_id', async (req, res) => {
    let _id = new ObjectId(req.params._id);
    let respUser = await users.deleteOne({"_id" : _id},{})
    console.log('inside user/delete',respUser);
    if(respUser && respUser.deletedCount){
        res.json({ deleted:true, deletedData : respUser[0]});
    } else {
        res.json({ deleted:false, deletedData : {}});
    }
});