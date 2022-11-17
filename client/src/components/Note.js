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

        // TODO: Tie in to database
        console.log(this.state.noteName + ", " + this.state.text);
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
                    <input type="saveButt" name="save" value="Save Note" className="saveButton"/>
                </form>
            </div>
        );
    }
}

export default Note;