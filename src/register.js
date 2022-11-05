import React from 'react';
import './register.css';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      log: false,
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

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.log){
      this.setState({log: false});
      this.props.setActive('LoginForm');
    }
    else{
      alert('Attempting to Create Account: ' + this.state.username +' , ' + this.state.password);
      // TODO: Validation / data base
      // TODO: switching to home
    }
  }

  login() {
      this.setState({log: true});
  }

  render() {
    return (
      <div className="RegistrationForm">
        <form className="Form" onSubmit={this.handleSubmit}>
          <label>
            {"Username: "}
            <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
          </label>
          <br/>
          <label>
            {"Password: "}
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
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