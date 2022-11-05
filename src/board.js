import React from 'react';
import Note from './note.js';
import './board.css'

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notes: Array(12).fill(null)
        }
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.setActive('LoginForm');
    }

    render() {
        return(
            <>
            <div className="AppBar">
            <button name="addnote" onClick={this.addnote}>
                New Note
            </ button>
            <button name="logout" onClick={this.logout}>
                Log out
            </ button>
            </div>
            <div className="Board">
                {this.state.notes.map((note, index) => {
                    return(
                        < Note />
                    );
                })}
            </div>
            </>
        );
    }
}

export default Board;