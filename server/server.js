const express = require("express");
const mongoose = require("mongoose");
const app = express()
const cors = require('cors')

// enable access to all origins
app.use(cors())

// allows for req.body to get Axios POST data
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
    boardIds: [String]
});

const User = mongoose.model("user", userSchema);

/* BOARD SCHEMA AND MODEL */
const boardSchema = new mongoose.Schema({
    // Name of board
    boardname: String,
    // Array containing IDs of all notes belonging to board
    noteIds: [String]
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

    function createUser() {
        // create 3 new boards for the new user
        const newBoard1 = new Board({
            boardname: "Home"
        })

        const newBoard2 = new Board({
            boardname: "Shared"
        })
        
        const newBoard3 = new Board({
            boardname: "Polls and Charts"
        })
        
        // store the board id's in array to store for user
        const boardIDs = [newBoard1._id, newBoard2._id, newBoard3._id]

        // store the boards in an array to insert all of them into database
        const boardsToInsert = [newBoard1, newBoard2, newBoard3]

        // insert the 3 boards created above
        Board.insertMany(boardsToInsert)

        // create user document
        const newUser = new User({
            username: newUsername,
            password: newPassword,
            boardIds: boardIDs
        })

        // save the new user (which points to the 3 default boards)
        newUser.save(function(err) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(true)
            }
        })

    }

    User.findOne({username: newUsername}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            if (foundUser == null){
                createUser()
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

// to delete later, for testing only
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

app.post('/api/create-board/:userID/:boardname', async function(req,res){
    const userID = req.params.userID
    const newBoardName = req.params.boardname
    
    // create new board with inputted title
    const newBoard = new Board({
        boardname: newBoardName
    })

    // grab the board ID
    const newBoardId = String(newBoard._id)

    // find the user and update its boardIds array to include the created board
    await User.updateOne(
            {_id: mongoose.Types.ObjectId(userID)}, 
            {$push: {boardIds: [newBoardId]}}
    )

    // save that new board into the database
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

// returns all the boards for a specific user
app.get("/api/get-all-boards/:username", function(req, res) {
    const username = req.params.username
    

    User.findOne({username: username})
    .then(function(foundUser) {
        const allBoardIds = foundUser.boardIds
        console.log(allBoardIds)
        for (var i = 0; i < allBoardIds.length; i++) {
            allBoardIds[i] = mongoose.Types.ObjectId(allBoardIds[i])
        }
        console.log(allBoardIds)
        Board.find({_id: {$in: allBoardIds}}, function(err, allBoards) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(allBoards)
            }
        })

    })
    .catch(function(err) {
        res.send(err)
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