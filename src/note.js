import React from 'react';
import './note.css';

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

        // TODO: Tie in to database
        console.log(this.state.noteName + ", " + this.state.text);
    }

    render() {
        return(
            <div>
                <form className='Note' onSubmit={this.handleSubmit}>
                    <input name="noteName" type="text" placeholder="Name your note!" value={this.state.noteName} onChange={this.handleChange} />
                    <br/>
                    <label className='TextArea'>
                    <textarea
                        name="text"
                        placeholder="Start taking notes now!"
                        value={this.state.text}
                        onChange={this.handleChange} />
                    </label>
                    <br/>
                    <input type="submit" name="save" value="Save Note" />
                </form>
            </div>
        );
    }
}

export default Note;