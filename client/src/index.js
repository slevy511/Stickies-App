import React from 'react';
import ReactDOM from 'react-dom/client';
import Axios from 'axios';
import LoginForm from './components/Login'
import RegistrationForm from './components/Register'
import Board from './components/Board'
import Lowerbar from './components/Lowerbar'
import logo from './logo.png'

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      active: 'LoginForm',
      user: null,
      boardNum: 0,
      boards: [],
      toggle: false
    }

    this.setActive = this.setActive.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.boardSelect = this.boardSelect.bind(this)
    this.createBoard = this.createBoard.bind(this)
    this.deleteBoard = this.deleteBoard.bind(this)
    this.search = this.search.bind(this)
  }

  async login(uname){
    const all_boards = await Axios.get("http://localhost:8000/api/get-all-boards/" + uname)
    const bds = all_boards.data
    this.setState({active: 'Board', user: uname, boardNum: 0, boards: bds})
  }

  setActive(s){
    this.setState({active: s})
  }

  logout(){
    this.setState({active: 'LoginForm', user: null, boardNum: 0, boards: []})
  }

  boardSelect(event){
    const next = !(this.state.toggle)
    this.setState({
      boardNum: event.target.value, toggle: next
    })
  }

  async createBoard(boardName){
    if (boardName === ''){
      
    }
    else {
      const created = await Axios.post("http://localhost:8000/api/create-board", {
        username: this.state.user,
        boardname: boardName
      })
      if (created.data){
        const all_boards = await Axios.get("http://localhost:8000/api/get-all-boards/" + this.state.user)
        const bds = all_boards.data
        this.setState({boards: bds})
      }
      else {
        
      }
    }
  }

  async deleteBoard(){
    if (this.state.boardNum <= 2){
      window.alert("You cannot delete the default board '" + this.state.boards[this.state.boardNum].boardname + "'")
    }
    else{
      if(window.confirm("Delete board: '" + this.state.boards[this.state.boardNum].boardname + "'\nAre you sure?")){
        const deleted = await Axios.post("http://localhost:8000/api/delete-board", {
          boardID: this.state.boards[this.state.boardNum]._id,
          username: this.state.user
        })
        if (deleted){
          const all_boards = await Axios.get("http://localhost:8000/api/get-all-boards/" + this.state.user)
          const bds = all_boards.data
          const next = !(this.state.toggle)
          this.setState({boards: bds, boardNum: 0, toggle: next})
        }
      }
    }
  }

  async search(searchString){

    const changed = await Axios.post("http://localhost:8000/api/search-user", {
      query: searchString,
      username: this.state.user
    })
    if (changed){
      const all_boards = await Axios.get("http://localhost:8000/api/get-all-boards/" + this.state.user)
      const bds = all_boards.data
      const next = !(this.state.toggle)
      this.setState({boards: bds, boardNum: 2, toggle: next})
    }
  }

  render(){
    const activeBoard = this.state.boards[this.state.boardNum]
    return (
      <div>
        {this.state.active === 'LoginForm' ?
        <LoginForm login={this.login} setActive={this.setActive} />
        : null}
        {this.state.active === 'RegistrationForm' ?
        <RegistrationForm login={this.login} setActive={this.setActive} />
        : null}
        {this.state.active === 'Board' && this.state.toggle ?
        <Board logout={this.logout} user={this.state.user} activeBoard={activeBoard} boardNum={this.state.boardNum}/>
        : null}
        {this.state.active === 'Board' && !this.state.toggle ?
        <Board logout={this.logout} user={this.state.user} activeBoard={activeBoard} boardNum={this.state.boardNum} />
        : null}
        {this.state.active === 'Board' ?
        <Lowerbar boards={this.state.boards} boardNum={this.state.boardNum} boardSelect={this.boardSelect}
        createBoard={this.createBoard} deleteBoard={this.deleteBoard} search={this.search} />
        : null}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
