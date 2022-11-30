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
      errstate: 0,
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
          if (created.data){
            this.props.login(this.state.username)
          }
          else{
            this.setState({errstate: 1});
          }
        }
    }
  }

  login() {
      this.setState({log: true});
  }

  render() {
      return (
          <div className="startup-form">
              <img className="logo" src={logo} alt={"Stickies!"} />
              <br/>
              <img className="logoRight" src={logo} alt={"Stickies!"} />
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>

              <div className="contents">
                <div className="banner">
                  <label name="banner">
                          {"Create an account below!"}
                          
                  </label>
                </div>
                <br/>
                <form className="form" onSubmit={this.handleSubmit}>
                  <br/>
                  <header className="startupHeader">
                    <small>
                      <small>
                        <pre className="messagePrompt">
                          {this.state.errstate === 0 ? "Please enter a username\nand password." : 
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
                  <input type="submit" name="login" className="takeAction" value="Create Account" />
                  <br/>
                  {"Already have an account?"}
                  <br/>
                  <button name="login" className="switchPage" onClick={this.login} >
                    Log in
                  </button>
                </form>
              </div>  
          </div>
      );
  }
}

export default RegistrationForm;