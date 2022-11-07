import React from 'react';
import Note from './Note.js';

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notes: [0]
        }
        this.logout = this.logout.bind(this);
        this.addnote = this.addnote.bind(this);
    }

    logout() {
        this.props.setActive('LoginForm');
    }

    addnote() {
        this.setState({
            notes: this.state.notes.concat(this.state.notes[this.state.notes.length - 1] + 1)
        });
    }

    render() {
        return(
            <>
            <div className="app-bar">
            <button name="addnote" onClick={this.addnote}>
                New Note
            </button>
            <button name="logout" onClick={this.logout}>
                Log out
            </button>
            </div>
            <div className="board">
                {this.state.notes.map((note, index) => {
                    return(
                        < Note key={index} />
                    );
                })}
            </div>
            </>
        );
    }
}

export default Board;