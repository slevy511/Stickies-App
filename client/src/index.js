import React from 'react';
import ReactDOM from 'react-dom/client';
import Axios from 'axios';
import LoginForm from './components/Login'
import RegistrationForm from './components/Register'
import Board from './components/Board'
import logo from './logo.png'

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      active: 'LoginForm',
      user: null,
      boardNum: 0,
      boards: []
    }

    this.setActive = this.setActive.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
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

  render(){
    return (
      <div>
        {this.state.active === 'LoginForm' ?
        <LoginForm login={this.login} setActive={this.setActive} />
        : null}
        {this.state.active === 'RegistrationForm' ?
        <RegistrationForm login={this.login} setActive={this.setActive} />
        : null}
        {this.state.active === 'Board' ?
        <Board logout={this.logout} user={this.state.user} activeBoard={this.state.boards[this.state.boardNum]}/>
        : null}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
