import React from 'react';
import logo from './logo.png'
import Axios from 'axios';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      log: false,
      errstate: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.log){
        this.setState({log: false});
        this.props.setActive('LoginForm');
    }
    else{
        if (this.state.username === '' || this.state.password === ''){
            this.setState({errstate: 0});
        }
        else {
          const created = await Axios.post("http://localhost:8000/api/create-user/" + this.state.username + "/" + this.state.password)
          this.setState({errstate: created.data});
          if (created.data){
            this.props.login(this.state.username)
          }
        }
    }
  }

  login() {
      this.setState({log: true});
  }

  render() {
    return (
      <div className="registration-form">
        <img className="logo3" src={logo} alt={"Stickies!"} />
        <br/>
        <img className="logo3right" src={logo} alt={"Stickies!"} />
        <br/>
        <form className="banner" onSubmit={this.handleSubmit}>
                    <label name="banner">
                            {"Create an account below!"}
                            
                    </label>
        </form>
        <form className="form" onSubmit={this.handleSubmit}>
          <header className="registerHeader">
            Register
            <small>
              <small>
                <pre className="registerPrompt">
                  {this.state.errstate === true ? "Please enter a username\nand password." : 
                  "That username is taken.\nTry another username."}
                </pre>
              </small>
            </small>
          </header>
          <label>
            {"Username: "}
            <input name="username" className="userName" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
          </label>
          <br/>
          <label>
            {"Password: "}
            <input name="password" className="passWord" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
          </label>
          <br/>
          <input type="submit" name="login" className="createAccount" value="Create Account" />
          <br/>
          {"Already have an account?"}
          <br/>
          <button name="login" className="LogIn" onClick={this.login} >
            Log in
          </button>
        </form>
      </div>
    );
  }
}

export default RegistrationForm;