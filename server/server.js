const express = require("express");
const mongoose = require("mongoose");
const app = express()
const cors = require('cors')

// enable access to all origins
app.use(cors())

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://root:root@stickies.p61illk.mongodb.net/stickies_db?retryWrites=true');
}

/* ***************** SCHEMAS AND MODELS ***************** */

/* USER SCHEMA AND MODEL */
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("user", userSchema);



/* ***************** API ENDPOINTS ***************** */


/* USER API */

app.post('/api/create-user/:username/:password', function(req, res){
    // create a user, if and only if username is not in use

    const newUsername = req.params.username
    const newPassword = req.params.password

    const newUser = new User({
        username: newUsername,
        password: newPassword
    })

    User.findOne({username: newUsername}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            if (foundUser == null){
                newUser.save(function(err){
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.send(true)
                    }
                })
            }
            else{
                res.send(false)
            }
        }
    })
})

app.get('/api/valid-login/:username/:password', function(req, res) {
    // sends 'true' if password matches for the user, 'false' if user doesn't exist or password doesn't match

    const searchUsername = req.params.username
    const password = req.params.password

    User.findOne({username: searchUsername}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            if (foundUser == null){
                res.send(false)
            }
            else{
                res.send(foundUser.password == password)
            }
        }
    })

})

app.get('/api/search-user/:username', function(req, res) {
    // searching for a user

    const searchUsername = req.params.username

    // sends the user object that matches the username, error otherwise
    User.findOne({username: searchUsername}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(foundUser)
        }
    })
})

// sends back all users & passwords for testing purposes
app.get('/api/all-users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            console.log(err)
            res.send("Error!")
        }
        else {
            // users is an array of JavaScript user objects
            res.send(users)
        }
    })
})

/* NOTE API */



/* BOARD API */



app.post('/', function(req, res, next) {
    res.send("all working!: POST")
});

app.listen(8000, function(req, res) {
    console.log("Listening on port 8000")
})