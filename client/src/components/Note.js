import axios from 'axios';
import React from 'react';

class Note extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            noteName: '',
            text: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Add note to database!
        axios.post("http://localhost:8000/api/create-note", {
            notename: this.state.noteName,
            content: this.state.text
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });

        // TODO: Tie in to database
        console.log(this.state.noteName + ", " + this.state.text);
    }

    render() {
        return(
            <div>
                <form className='note' onSubmit={this.handleSubmit}>
                    <input className="name" name="noteName" type="text" placeholder="Name your note!" value={this.state.noteName} onChange={this.handleChange} />
                    <br/>
                    <textarea
                        name="text"
                        placeholder="Start taking notes now!"
                        value={this.state.text}
                        onChange={this.handleChange} />
                    <br/>
                    <input type="submit" name="save" value="Save Note" />
                </form>
            </div>
        );
    }
}

export default Note;