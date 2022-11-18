import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './components/Login'
import RegistrationForm from './components/Register'
import Board from './components/Board'
import logo from './logo.png'

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

        <h1 className="appName"> Stickies!</h1>
        <img className="logo" src={logo} alt={"Stickies!"} />

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
