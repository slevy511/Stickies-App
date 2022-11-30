import axios from 'axios';
import React from 'react';

class Note extends React.Component{
    constructor(props){
        super(props);
        const contents = this.props.note.contents == null ? '' : this.props.note.contents[0]
        this.state = {
            noteName: this.props.note.notename,
            text: contents,
            targetUser: '',
            changed: false,
            boardSelect: this.props.boardNum
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.shareNote = this.shareNote.bind(this)
        this.addToBoard = this.addToBoard.bind(this)
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
        this.setState({
            boardSelect: event.target.value
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


    async addToBoard() {
        const shared = await axios.post("http://localhost:8000/api/add-to-board", {
            noteID: this.props.note._id,
            boardID: this.props.boards[this.state.boardSelect]._id
        })
        if (shared.data){
            this.setState({
                boardSelect: this.props.boardNum
            })
        }
    }

    deleteButton(){
        if (this.props.boardNum == 2){
            return(
                <button name="delete" className="deleteNoteDummy">
                    X
                </button>
            )
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

    boardButton(){
        if (this.props.boards[this.state.boardSelect].boardname === "Search Results"){
            return(
                <button name="addToBoard" className="addToBoardDisabled">
                    Add To Board
                </button>
            )
        }
        else{
            return(
                <button name="addToBoard" className="addToBoardEnabled" onClick={this.addToBoard}>
                    Add To Board
                </button>
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
                    <select className="boardSelect" name="boardSelect" value={this.state.boardSelect} onChange={this.handleSelect}>
                        { this.props.boards.map((board, index) => 
                        <option key={index} value={index}>{board.boardname}</option>)}
                    </select>
                    {this.boardButton()}
                    <input type="text" className="shareTarget" name="targetUser" placeholder="Share Note! Enter a valid user." value={this.state.targetUser} onChange={this.handleChange} />
                    <button name="share" className="shareNote" onClick={this.shareNote}>
                        Share
                    </button>
                </form>
            </div>
        );
    }
}
/*
<select className="boardSelect" name="boardSelect" value={this.props.boardNum} onChange={this.boardButton}>
    { this.props.boards.map((board, index) => 
    <option key={index} value={index}>{board.boardname}</option>)}
</select>
<button name="boardSelect" className="shareToBoard" onClick={this.shareNote2}>
    Add to Board Dummy
</button>
*/
export default Note;