import axios from 'axios';
import React from 'react';

class Note extends React.Component{
    constructor(props){
        super(props);
        const contents = this.props.note.contents == null ? '' : this.props.note.contents[0]
        // console.log(this.props.notes.contents)
        this.state = {
            noteName: this.props.note.notename,
            text: contents
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.noteName)
        console.log(this.state.text)
        console.log(this.props.note)
        // Update note in database
        await axios.post("http://localhost:8000/api/update-note", {
            notename: this.state.noteName,
            content: this.state.text,
            noteID: this.props.note._id
        })
    }

    render() {
        return(
            <div>
                <form className='note' onSubmit={this.handleSubmit}>
                    <input className="name" name="noteName" type="noteName" placeholder="Name your note!" value={this.state.noteName} onChange={this.handleChange} />
                    <br/>
                    <textarea
                        name="text"
                        placeholder="Start taking notes now!"
                        value={this.state.text}
                        onChange={this.handleChange} />
                    <br/>
                    <input type="submit" name="save" value="Save Note" className="saveButton"/>
                    <button name="delete" onClick={() => this.props.deletenote(this.props.note._id, this.props.ind)}>
                        Delete Note
                    </button>
                </form>
            </div>
        );
    }
}

export default Note;