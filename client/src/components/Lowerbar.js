import React from 'react';

class Lowerbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newBoardName: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(event) {
        this.setState({
            newBoardName: event.target.value
        })
    }

    handleClick() {
        const boardname = this.state.newBoardName
        this.setState({
            newBoardName: ''
        })
        this.props.createBoard(boardname)
    }

    render(){
        return(
            <div className='lowerbar'>
                <select value={this.props.boardNum} onChange={this.props.boardSelect}>
                    { this.props.boards.map((board, index) => <option key={index} value={index}>{board.boardname}</option>)}
                </select>

                <input className="boardname" name="newBoardName" type="text" placeholder="Name your new board"
            value={this.state.newBoardName} onChange={this.handleChange} />
                <button name="newboard" className="createBoard" onClick={this.handleClick}>
                    Create new board
                </button>
                <button name="deleteboard" className="deleteBoard" onClick={this.props.deleteBoard}>
                    Delete Current Board
                </button>
            </div>
        )
    }
}

export default Lowerbar;