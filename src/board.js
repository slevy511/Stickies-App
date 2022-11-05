import React from 'react';
import Note from './note.js';
import './board.css'

class Board extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="Background">
                < Note />
            </div>
        );
    }
}

export default Board;