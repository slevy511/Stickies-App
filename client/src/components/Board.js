import React from 'react';
import Note from './Note.js';
import logo from './logo.png'
import Axios from 'axios';

class Board extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            notes: []
        }

        this.getNotes = this.getNotes.bind(this)
        this.logout = this.logout.bind(this)
        this.addnote = this.addnote.bind(this)
        this.deletenote = this.deletenote.bind(this)

        this.getNotes()
    }

    logout() {
        this.props.logout()
    }

    async getNotes(){
        const all_notes = await Axios.get("http://localhost:8000/api/get-all-notes/" + this.props.activeBoard._id)
        this.setState({notes: all_notes.data})
    }

    async addnote() {
        const newnote = await Axios.post("http://localhost:8000/api/create-note", {
            notename: '',
            content: '',
            boardID: this.props.activeBoard._id
        })
        this.setState({
            notes: this.state.notes.concat(newnote.data)
        });
    }

    async deletenote(noteID_in, index) {
        await Axios.post("http://localhost:8000/api/delete-note", {
            noteID: noteID_in,
            boardID: this.props.activeBoard._id
        })
        console.log(index)
        const notes = this.state.notes
        notes.splice(index, 1)
        this.setState({
            notes: notes
        })
    }

    render() {
        return(
            <>
            <div className="app-bar">
            <img className="logo2" src={logo} alt={"Stickies!"} />
            <div className="boardNameBanner">
                    <label name="banner">
                            {this.props.activeBoard.boardname}        
                    </label>
            </div>
            <button className="addnote" name="addnote" onClick={this.addnote}>
                New Note
            </button>
            <button className="logout" name="logout" onClick={this.logout}>
                Log Out
            </button>
            </div>
            <div className="board">
                {this.state.notes.map((note, index) => {
                    return(
                        < Note
                        note={note}
                        boardNum={this.props.boardNum}
                        boardID={this.props.activeBoard._id}
                        user={this.props.user}
                        deletenote={(i, j) => this.deletenote(i, j)}
                        ind={index}
                        key={note._id} />
                    );
                })}
            </div>
            </>
        );
    }
}

export default Board;