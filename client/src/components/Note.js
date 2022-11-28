import axios, { Axios } from 'axios';
import React from 'react';

class Note extends React.Component{
    constructor(props){
        super(props);
        const contents = this.props.note.contents == null ? '' : this.props.note.contents[0]
        this.state = {
            noteName: this.props.note.notename,
            text: contents,
            targetUser: '',
            changed: false
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.shareNote = this.shareNote.bind(this)
        this.shareNote2 = this.shareNote2.bind(this)
        this.deleteButton = this.deleteButton.bind(this)
        this.saveButton = this.saveButton.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value,
        });
        if (name != "targetUser"){
            this.setState({
                changed: true
            })
        }
    }

    handleSelect(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        // Update note in database
        await axios.post("http://localhost:8000/api/update-note", {
            notename: this.state.noteName,
            content: this.state.text,
            noteID: this.props.note._id
        })
        this.setState({
            changed: false
        })
    }

    async shareNote() {
        const targetUser = this.state.targetUser
        if (targetUser === ''){

        }
        else if (targetUser === this.props.user) {

        }
        else {
            const shared = await axios.post("http://localhost:8000/api/share-note", {
                noteID: this.props.note._id,
                destUser: targetUser
            })
            if (shared.data){
                this.setState({
                    targetUser: ''
                })
            }
        }
    }

    async shareNote2() {
        const targetUser = this.props.user
        const targetBoard = this.state.targetBoard
        if (targetUser === ''){

        }
        else if (targetUser === this.props.user) {
            const shared = await axios.post("http://localhost:8000/api/share-note-2", {
                noteID: this.props.note._id,
                destUser: targetUser
            })
            if (shared.data){
                this.setState({
                    targetUser: ''
                })
            }
        }
        else {
            
        }
    }

    deleteButton(){
        if (this.props.boardNum == 2){
            return null
        }
        else{
            return(
                <button name="delete" className="deleteNote" onClick={() => this.props.deletenote(this.props.note._id, this.props.ind, this.state.noteName)}>
                    X
                </button>
            )
        }
    }

    saveButton(){
        if (this.state.changed){
            return(
                <input type="submit" name="save" value="Save Note" className="saveButtonChanged"/>
            )
        }
        else {
            return(
                <input type="submit" name="save" value="Save Note" className="saveButtonUnchanged"/>
            )
        }
    }

    render() {
        return(
            <div>
                <form className='note' onSubmit={this.handleSubmit}>
                    <input className="name" name="noteName" type="text" placeholder="Name your note!" value={this.state.noteName} onChange={this.handleChange} />
                    {this.deleteButton()}
                    <br/>
                    <textarea 
                        className = "noteText"
                        name="text"
                        placeholder="Start taking notes now!"
                        value={this.state.text}
                        onChange={this.handleChange} />
                    <br/>
                    <button name="left" className="leftShift" onClick={() => this.props.leftShift(this.props.ind)}>
                        ←
                    </button>
                    <button name="right" className="rightShift" onClick={() => this.props.rightShift(this.props.ind)}>
                        → 
                    </button>
                    {this.saveButton()}
                    <br/>
                    <select className="boardSelect" value={this.props.boardNum} onChange={this.props.boardSelect}>
                        { this.props.boards.map((note, board, index) => <option key={index} value={index}>{note.notename}{board.boardname}</option>)}
                    </select>
                    <input type="text" className="shareTarget" name="targetUser" placeholder="Share Note! Enter a valid user." value={this.state.targetUser} onChange={this.handleChange} />
                    <button name="share" className="shareNote" onClick={this.shareNote}>
                        Share
                    </button>
                    
                </form>
            </div>
        );
    }
}

export default Note;