import React from 'react';
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

  // handleSubmit(event) {
  //   event.preventDefault();
  //   if (this.state.log){
  //     this.setState({log: false});
  //     this.props.setActive('LoginForm');
  //   }
  //   else{
  //     // TODO: Validation / data base
  //     this.props.setActive('Board');
  //   }
  // }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.log){
        this.setState({log: false});
        this.props.setActive('LoginForm');
    }
    else{
        // TODO: Validation / data base
        if (this.state.username === '' || this.state.password === ''){
            this.setState({errstate: 0});
        }
        else {
          const created = await Axios.post("http://localhost:8000/api/create-user/" + this.state.username + "/" + this.state.password)
          this.setState({errstate: created.data});
          if (created.data){
            this.props.setActive('Board');
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
        <form className="form" onSubmit={this.handleSubmit}>
          <header>
            Register
            <small>
              <small>
                <pre>
                  {this.state.errstate === true ? "Please enter your username\nand password." : 
                  "That username is taken.\nTry another username."}
                </pre>
              </small>
            </small>
          </header>
          <label>
            {"Username: "}
            <input name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
          </label>
          <br/>
          <label>
            {"Password: "}
            <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
          </label>
          <br/>
          <input type="submit" name="login" value="Create Account" />
          <br/>
          {"Already have an account?"}
          <br/>
          <button name="login" onClick={this.login} >
            Log in
          </button>
        </form>
      </div>
    );
  }
}

export default RegistrationForm;