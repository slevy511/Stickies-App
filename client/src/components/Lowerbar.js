import React from 'react';

class Lowerbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newBoardName: '',
            searchString: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.createNewBoard = this.createNewBoard.bind(this)
        this.searchNotes = this.searchNotes.bind(this)
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        })
    }

    createNewBoard() {
        const boardname = this.state.newBoardName
        this.setState({
            newBoardName: ''
        })
        this.props.createBoard(boardname)
    }

    searchNotes() {
        const query = this.state.searchString
        this.setState({
            searchString: ''
        })
        this.props.search(query)
    }

    render(){
        return(
            <div className="lowerbar">
                <select value={this.props.boardNum} onChange={this.props.boardSelect}>
                    { this.props.boards.map((board, index) => <option key={index} value={index}>{board.boardname}</option>)}
                </select>

                <input className="boardname" name="newBoardName" type="text" placeholder="Name your new board"
            value={this.state.newBoardName} onChange={this.handleChange} />
                <button name="newboard" className="createBoard" onClick={this.createNewBoard}>
                    Create new board
                </button>
                <button name="deleteboard" className="deleteBoard" onClick={this.props.deleteBoard}>
                    Delete Current Board
                </button>
                <input className="search" name="searchString" type="text" placeholder="Search your notes"
            value={this.state.searchString} onChange={this.handleChange} />
                <button name="search" className="searchButton" onClick={this.searchNotes}>
                    Search Notes
                </button>
            </div>
        )
    }
}

export default Lowerbar;