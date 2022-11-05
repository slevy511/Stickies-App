import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LoginForm from './login.js'
import RegistrationForm from './register.js'
import Board from './board.js'

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      active: 'LoginForm'
    }

    this.setActive = this.setActive.bind(this);
  }

  setActive(s){
    this.setState({active: s})
  }

  render(){
    return (
      <div>
        {this.state.active === 'LoginForm' ? <LoginForm setActive={this.setActive}/> : null}
        {this.state.active === 'RegistrationForm' ? <RegistrationForm setActive={this.setActive} /> : null}
        {this.state.active === 'Board' ? <Board setActive={this.setActive} /> : null}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
