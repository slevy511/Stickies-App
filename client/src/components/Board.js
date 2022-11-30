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
        this.addButton = this.addButton.bind(this)
        this.leftShift = this.leftShift.bind(this)
        this.rightShift = this.rightShift.bind(this)

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
        await Axios.post("http://localhost:8000/api/create-note", {
            notename: '',
            content: '',
            boardID: this.props.activeBoard._id
        })
        this.getNotes()
    }

    async deletenote(noteID_in, index, notename) {
        if (window.confirm("Delete note: '" + notename + "'\nAre you sure?")){
            await Axios.post("http://localhost:8000/api/delete-note", {
                noteID: noteID_in,
                boardID: this.props.activeBoard._id
            })
            this.getNotes()
        }
    }

    async leftShift(index){
        const shifted = await Axios.post("http://localhost:8000/api/shift-left", {
            boardID: this.props.activeBoard._id,
            ind: index
        })
        if (shifted.data){
            this.getNotes()
        }
    }

    async rightShift(index){
        const shifted = await Axios.post("http://localhost:8000/api/shift-right", {
            boardID: this.props.activeBoard._id,
            ind: index
        })
        if (shifted.data){
            this.getNotes()
        }
    }

    addButton(){
        if (this.props.boardNum === 1 || this.props.boardNum === 2){
            return null
        }
        else{
            return(
                <button className="addnote" name="addnote" onClick={this.addnote}>
                    New Note
                </button>
            )
        }
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
            {this.addButton()}
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
                        boards={this.props.boards}
                        user={this.props.user}
                        deletenote={(i, j, k) => this.deletenote(i, j, k)}
                        rightShift={(i) => this.rightShift(i)}
                        leftShift={(i) => this.leftShift(i)}
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