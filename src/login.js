import React from 'react';
import './login.css';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    handleSubmit(event) {
        alert('FORM SUBMISSION: ' + this.state.username +' , ' + this.state.password);
        event.preventDefault();
        // TODO: Validation / data base
        // TODO: switching to home
    }

    registration() {
        // TODO: switch to registration page
    }

    render() {
        return (
            <div className="LoginForm">
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
                    <input type="submit" value="Log in" />
                    <br/>
                    <button name="register" onClick={this.registration}>
                        Register Now
                    </button>
                </form>
            </div>
        );
    }
}

export default LoginForm;