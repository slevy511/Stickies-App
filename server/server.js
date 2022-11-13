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

/* NOTE SCHEMA AND MODEL */
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model("note", noteSchema);

/* BOARD SCHEMA AND MODEL */
const boardSchema = new mongoose.Schema({
    title: String
});

const Board = mongoose.model("board", boardSchema);

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

app.post('/api/delete-user/:username', function(req, res) {
    // searching for a user

    const searchUsername = req.params.username

    // sends the user object that matches the username, error otherwise
    User.deleteOne({username: searchUsername}, function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
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

//accepts title and content and posts it to database
//nodemon server.js

function sayHi(req, res) {
    res.send("Hello")
}

app.post('/api/create-note/:title/:content', function(req,res){
    const newTitle = req.params.title
    const newContent = req.params.content


    const newNote = new Note({
        title: newTitle,
        content: newContent
    })

    newNote.save(function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
        }
    })


});

// sends back all users & passwords for testing purposes
app.get('/api/all-notes', function(req, res) {
    Note.find(function(err, notes) {
        if (err) {
            console.log(err)
            res.send("Error!")
        }
        else {
            // users is an array of JavaScript user objects
            res.send(notes)
        }
    })
})

app.post('/api/delete-note/:id', function(req, res) {
    // searching for a user

    const searchId = req.params.id

    // sends the user object that matches the username, error otherwise
    Note.deleteOne({_id: searchId}, function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
        }
    })
})




/* BOARD API */

app.post('/api/create-board/:title', function(req,res){
    const newTitle = req.params.title
    
    const newBoard = new Board({
        title: newTitle
    })

    newBoard.save(function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
        }
    })

});

app.get('/api/search-board/:title', function(req, res) {
    // searching for a board

    const searchTitle = req.params.title

    // sends the board object that matches the title, error otherwise
    Board.findOne({title: searchTitle}, function(err, foundTitle) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(foundTitle)
        }
    })
})

app.post('/api/delete-board/:id', function(req, res) {
    // searching for a board

    const searchId = req.params.id

    // sends the board object that matches the id, error otherwise
    Board.deleteOne({_id: searchId}, function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send("Success!")
        }
    })
})

// sends back all boards
app.get('/api/all-boards', function(req, res) {
    Board.find(function(err, boards) {
        if (err) {
            console.log(err)
            res.send("Error!")
        }
        else {
            // boards is an array of JavaScript board objects
            res.send(boards)
        }
    })
})



app.post('/', function(req, res, next) {
    res.send("all working!: POST")
});

app.listen(8000, function(req, res) {
    console.log("Listening on port 8000")
})