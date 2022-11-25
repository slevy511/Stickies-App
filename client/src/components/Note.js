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
        this.deleteButton = this.deleteButton.bind(this)
        this.saveButton = this.saveButton.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value,
            changed: true
        });
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
                    <input type="text" className="shareTarget" name="targetUser" placeholder="Share your note!" value={this.state.targetUser} onChange={this.handleChange} />
                    <button name="share" className="shareNote" onClick={this.shareNote}>
                        Share
                    </button>
                </form>
            </div>
        );
    }
}

export default Note;