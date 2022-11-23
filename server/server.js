const express = require("express");
const mongoose = require("mongoose");
const app = express()
const cors = require('cors')

// enable access to all origins
app.use(cors())

// allows for req.body to get Axios POST data
app.use(express.json())

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
    notename: String,
    // Background color (modifies CSS)
    color: String,
    // Number of references to note - default is 1
    linkcount: {type: Number, default: 1},
    contents: [String],
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
            boardname: "Search Results"
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

// TODO: FIX
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

app.post('/api/create-board', async function(req,res){
    // create a board, if and only if that user doesn't already have a board with that name
    const uname = req.body.username
    const newBoardName = req.body.boardname
    
    async function createBoard() {
        // create new board with inputted title
        const newBoard = new Board({
            boardname: newBoardName
        })

        // grab the board ID
        const newBoardId = String(newBoard._id)

        // find the user and update its boardIds array to include the created board
        await User.updateOne(
            {username: uname}, 
            {$push: {boardIds: [newBoardId]}}
        )

        // save that new board into the database
        newBoard.save(function(err) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(true)
            }
        })
    }

    User.findOne({username: uname}, async function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            // user does not exist
            if (foundUser == null){
                res.send(false)
            }
            // user exists
            else{
                const allBoardIds = foundUser.boardIds
                Board.findOne({_id: {$in : allBoardIds}, boardname: newBoardName}, async function(err, foundBoard){
                    if (err) {
                        res.send(err)
                    }
                    else {
                        // if the board doesn't exist for that user, create the board
                        if (foundBoard == null) {
                            createBoard()
                        }
                        // otherwise, false
                        else {
                            res.send(false)
                        }
                    }
                })
            }
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

    // find user given the username
    User.findOne({username: username})
    .then(function(foundUser) {

        // get board ID array for found user
        const allBoardIds = foundUser.boardIds

        // finds all boards with ID's in the allBoardIds array
        Board.find({_id: {$in: allBoardIds}}, function(err, allBoards) {
            if (err) {
                res.send(err)
            }
            else {
                // send the array of all boards
                res.send(allBoards)
            }
        })
    })
    .catch(function(err) {
        res.send(err)
    })

})

app.post('/api/delete-board', function(req, res) {
    // searching for a board
    const boardID = req.body.boardID
    const uname = req.body.username

    // handle notes contained in board
    Board.findById(mongoose.Types.ObjectId(boardID), async function(err, foundBoard){
        if (err) {
            res.send(err)
        }
        else {
            // if the board is present:
            if (foundBoard != null) {
                // for each note in the board, decrement link count, and delete if no more links
                const allNoteIds = foundBoard.noteIds
                await Note.updateMany({_id: { $in : allNoteIds}}, {$inc: { linkcount: -1 }})
                await Note.deleteMany({_id: { $in : allNoteIds}, linkcount: 0})
            }
        }
    })

    // remove board from user
    User.updateOne({username: uname}, {$pull: {boardIds: boardID}}, function(err){
        if (err) {
            res.send(err)
            return
        }
    })

    // delete board
    Board.deleteOne({_id: boardID}, function(err, result) {
        if (err) {
            res.send(err)
        }
        else {
            if (result.deletedCount == 1){
                res.send(true)
            }
            else {
                res.send(false)
            }
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

app.get('/api/get-all-notes/:boardID', function(req, res)
{
    const boardID = req.params.boardID

    Board.findOne({_id: boardID}, function(err, foundBoard) {
        if(err){
            res.send(err)
        }
        else{
            const allNoteIds = foundBoard.noteIds
            Note.find({_id: { $in: allNoteIds }}, function(err, allNotes){
                if (err){
                    res.send(err)
                }
                else{
                    res.send(allNotes)
                }
            })
        }
    })

})

app.post('/api/create-or-update-note', async function(req, res){
    const newNoteName = req.body.notename
    const newContent = req.body.content
    const boardID = req.body.boardID
    const noteID = req.body.noteID

    function updateNote() {
        Note.updateOne(
            // update note with the ID specified
            {_id: noteID},

            // set notename and content attribtues to updated versions
            {
                $set: {
                    notename: newNoteName,
                    contents: [newContent]
                }
            }, function(err){
                if (err) {
                    res.send(err)
                }
                else {
                    res.send(true)
                }
            }
        )
    }

    async function createNote(){
        // create a new note
        const newNote = new Note({
            notename: newNoteName,
            contents: [newContent]
        })
        // use the NEW note's ID, not the one provided (which does not exist)
        newNoteID = newNote._id
        
        await Board.updateOne(
            // update board with the ID specified
            {_id: boardID},
            {$push: {noteIds: [newNoteID]}}
        )

        await newNote.save(function(err) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(true)
            }
        })
    }

    Note.findById(mongoose.Types.ObjectId(noteID), function(err, foundNote) {
        if (err) {
            res.send(err)
        }
        else {
            if (foundNote == null){
                createNote()
            }
            else {
                updateNote()
            }
        }
    })
});

app.post('/api/create-note', async function(req,res){
    const newNoteName = req.body.notename
    const newContent = req.body.content
    const boardID = req.body.boardID

    const newNote = new Note({
        notename: newNoteName,
        contents: [newContent]
    })

    const newNoteID = newNote._id

    await Board.updateOne(
        {_id: boardID}, 
        
        // push the new note ID to the FRONT of the noteIds array
        { $push: {
            noteIds: {
                $each: [newNoteID],
                $position: 0
            }
        }}
    )

    newNote.save(function(err) {
        if (err) {
            res.send(err)
        }
        else {
            res.send(newNote)
        }
    })
});

app.post("/api/update-note", function(req, res) {
    const newNoteName = req.body.notename
    const newContent = req.body.content
    const noteID = req.body.noteID

    Note.updateOne(
        // update note with the ID specified
        {_id: noteID},

        // set notename and content attributes to updated versions
        { 
            $set: {
                notename: newNoteName,
                contents: [newContent]
            }
        }
    )
    .then(function(obj) {
        res.send("Updated object")
    })
    .catch(function(err) {
        res.send(err)
    })
}) 

app.post('/api/delete-note/', function(req, res) {
    const noteID = req.body.noteID
    const boardID = req.body.boardID

    // ensure the board is in the database
    Board.findById(mongoose.Types.ObjectId(boardID), function(err, foundBoard){
        if (err){
            res.send(err)
            return
        }
        else {
            if (foundBoard == null){
                res.send(false)
                return
            }
            else{
                if (foundBoard.noteIds.includes(noteID)){
                    // update specified board
                    Board.updateOne({_id: boardID}, {$pull: {noteIds: noteID}}, function(err){
                        if (err){
                            res.send(err)
                            return
                        }
                    })
                    Note.findById(noteID, function(err, foundNote){
                        if (err){
                            res.send(err)
                        }
                        else{
                            if (foundNote == null){
                                res.send(false)
                            }
                            else{
                                // If note currently has linkcount 1, delete it
                                if (foundNote.linkcount == 1){
                                    Note.deleteOne({_id: noteID, linkcount: 1}, function(err) {
                                        if (err) {
                                            res.send(err)
                                            return
                                        }
                                    })
                                }
                                // Otherwise, decrement the link count
                                else {
                                    Note.findByIdAndUpdate(mongoose.Types.ObjectId(noteID), {$inc: { linkcount: -1}}, { new: true }, function(err){
                                        if (err){
                                            res.send(err)
                                            return
                                        }
                                    })
                                }
                                res.send(true)
                            }
                        }
                    })
                }
                else {
                    res.send(false)
                }
            }
        }
    })
})

app.post('/api/share-note', function(req, res){
    const noteID = req.body.noteID
    const destUser = req.body.destUser

    // ensure the note is in the database
    Note.findById(mongoose.Types.ObjectId(noteID), function(err, foundNote) {
        if (err) {
            res.send(err)
        }
        else {
            if (foundNote == null){
                res.send(false)
            }
            else {
                User.findOne({username: destUser}, function(err, foundUser){
                    if (err) {
                        res.send(err)
                    }
                    else {
                        // if destUser is in the databse, get the id of their "shared" board
                        // if not, return false
                        if (foundUser == null){
                            res.send(false)
                        }
                        else {
                            // find the "Shared" board's ID
                            const allBoardIds = foundUser.boardIds
                            Board.findOne({_id: { $in : allBoardIds}, boardname: "Shared"}, function(err, foundBoard){
                                if (err) {
                                    res.send(err)
                                }
                                else {
                                    if (foundBoard == null) {
                                        res.send(false)
                                    }
                                    else {
                                        Board.findByIdAndUpdate(foundBoard._id, {$push: {noteIds: [noteID]}}, function (err){
                                            if (err){
                                                res.send(err)
                                            }
                                        })
                                        Note.findByIdAndUpdate(mongoose.Types.ObjectId(noteID), {$inc: { linkcount: 1} }, function(err, ){
                                            if (err) {
                                                res.send(err)
                                            }
                                            else{
                                                res.send(true)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

/* MOVE NOTE */
app.post('/api/shift-left/:boardID/:noteID', function(req, res) {
    // shifts note ID left and returns new array of notes in correct order
    const boardID = req.params.boardID
    const noteID = req.params.noteID
    
    Board.findOne({_id: boardID}, function(err, foundBoard) {
        if (err) {
            res.send(err)
        }
        else {
            const noteIDs = foundBoard.noteIds
            const noteIndex = noteIDs.indexOf(noteID)

            if (noteIndex === -1) {
                res.send("Error: Cannot find note with that note ID in the board")
            }
            else {
                if (noteIndex === 0) {
                    // cannot shift left, so do nothing
                    res.send(noteIDs)
                }
                else {
                    // switch noteID with the one before it
                    let temp = noteIDs[noteIndex - 1]
                    noteIDs[noteIndex - 1] = noteID
                    noteIDs[noteIndex] = temp
                    
                    // save new array into the database
                    Board.updateOne({_id: boardID}, { $set: {noteIds: noteIDs}}, function(err, response) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            res.send(noteIDs)
                        }
                    })
                }
            }
        }
    })
})

app.post('/api/shift-right/:boardID/:noteID', function(req, res) {
    // shifts note ID right and returns new array of notes in correct order
    const boardID = req.params.boardID
    const noteID = req.params.noteID
    
    Board.findOne({_id: boardID}, function(err, foundBoard) {
        if (err) {
            res.send(err)
        }
        else {
            const noteIDs = foundBoard.noteIds
            const noteIndex = noteIDs.indexOf(noteID)

            if (noteIndex === -1) {
                res.send("Error: Cannot find note with that note ID in the board")
            }
            else {
                if (noteIndex === (noteIDs.length - 1)) {
                    // if it's last element, we can't shift right
                    res.send(noteIDs)
                }
                else {
                    // switch noteID with the one after it
                    let temp = noteIDs[noteIndex + 1]
                    noteIDs[noteIndex + 1] = noteID
                    noteIDs[noteIndex] = temp
                    
                    // save new array into the database
                    Board.updateOne({_id: boardID}, { $set: {noteIds: noteIDs}}, function(err, response) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            res.send(noteIDs)
                        }
                    })
                }
            }
        }
    })    
})


// sends back all notes for testing purposes
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


/* SEARCH FUNCTIONALITY */
app.get("/api/search", function(req, res) {
    const query = req.body.query
    const username = req.body.username

    // find user that matches username
    User.findOne({username: username}, function(err, foundUser) {
        if (err) {
            res.send(err)
        }
        else {
            
            // get all boardIds for that given user
            const allBoardIds = foundUser.boardIds
            
            // convert board id array to array of board objects
            Board.find({_id: {$in: allBoardIds}}, function(err, allBoards) {
                if (err) {
                    res.send(err)
                }
                else {
                    // we now have an array of all board objects for that user

                    const allNoteIds = []
                    for (const board of allBoards) {
                        // append all the note id arrays together into one gigantic note id array
                        // if you want to look up the triple dots, it's called a spread operator
                        allNoteIds.push(...board.noteIds)
                    }

                    // convert note id array into array of note objects
                    Note.find({_id: {$in: allNoteIds}}, function(err, allNotes) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            const search_results = []
                            for (const note of allNotes) {
                                if ((note.notename).includes(query) || (note.contents[0].includes(query))) {
                                    search_results.push(note)
                                }
                            }
                            res.send(search_results)
                        }
                    })
                }
            }) 
        }
    })
})

app.listen(8000, function(req, res) {
    console.log("Listening on port 8000")
})