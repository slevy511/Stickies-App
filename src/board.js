import React from 'react';
import Note from './note.js';
import './board.css'

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notes: Array(12).fill(null)
        }
    }

    render() {
        return(
            <div className="Board">
                {this.state.notes.map((note, index) => {
                    return(
                        < Note />
                    );
                })}
            </div>
        );
    }
}

export default Board;