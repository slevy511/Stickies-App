const express = require("express");
const mongoose = require("mongoose");
const app = express()
const cors = require('cors')

// enable access to all origins
app.use(cors())

app.use(express.json());
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://root:root@stickies.p61illk.mongodb.net/stickies_db?retryWrites=true');
}

/* ***************** SCHEMAS AND MODELS ***************** */

/* USER SCHEMA AND MODEL */
const userSchema = new mongoose.Schema({
    // Username and password
    username: String,
    password: String,
    // Array containing IDs of all boards belonging to user
    boardIds: [{
        id: String
    }]
});

const User = mongoose.model("user", userSchema);

/* BOARD SCHEMA AND MODEL */
const boardSchema = new mongoose.Schema({
    // Name of board
    boardname: String,
    // Array containing IDs of all notes belonging to board
    noteIds: [{
        id: String
    }]
});

const Board = mongoose.model("board", boardSchema);

/* NOTE SCHEMA AND MODEL */
const noteSchema = new mongoose.Schema({
    // Notes have three modes: Note, Chart, and Poll
    mode: {type: String, default: "note"},
    notename: String,
    // Background color (modifies CSS)
    color: String,
    // Number of references to note - default is 1
    linkcount: {type: Number, default: 1},
    // If mode is Note: array of length 1
    // If mode is Chart: array of length 0
    // If mode is Poll: array of the poll options
    contents: [String],

    // Records responses to a poll
    // If mode is not poll, NULL
    responses: {
        type: Map,
        of: String
    },
    // Only for chart: poll to get data from
    pollId: String
});

const Note = mongoose.model("note", noteSchema);

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

/* BOARD API */

app.post('/api/create-board/:boardname', function(req,res){
    const newBoardName = req.params.boardname
    
    const newBoard = new Board({
        boardname: newBoardName
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

app.get('/api/search-board/:boardname', function(req, res) {
    // searching for a board

    const searchName = req.params.boardname

    // sends the board object that matches the boardname, error otherwise
    Board.findOne({boardname: searchName}, function(err, foundName) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(foundName)
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

/* NOTE API */

app.post('/api/create-note', function(req,res){
    const newNoteName = req.body.notename
    const newContent = req.body.content
    
    const newNote = new Note({
        notename: newNoteName,
        contents: [newContent]
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

app.post('/', function(req, res, next) {
    res.send("all working!: POST")
});

app.listen(8000, function(req, res) {
    console.log("Listening on port 8000")
})