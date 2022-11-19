import React from 'react';

import logo from './logo.png'

import Axios from 'axios';


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            reg: false,
            errstate: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.register = this.register.bind(this);
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
        if (this.state.reg){
            this.setState({reg: false});
            this.props.setActive('RegistrationForm');
        }
        else{
            if (this.state.username === '' || this.state.password === ''){
                this.setState({errstate: 0});
            }
            else{
                const response = await Axios.get("http://localhost:8000/api/valid-login/" + this.state.username + "/" + this.state.password)
                if(response.data){
                    this.props.login(this.state.username)
                }
                else{
                    this.setState({errstate: 1})
                }
            }
        }
    }

    register() {
        this.setState({reg: true});
    }

    render() {
        return (
           
            <div className="login-form">
                <img className="logo" src={logo} alt={"Stickies!"} />
                <br/>
                <img className="logoRight" src={logo} alt={"Stickies!"} />
                <br/>
                <form className="banner" onSubmit={this.handleSubmit}>
                    <label name="banner">
                            {"Welcome to Stickies! "}
                            
                    </label>
                </form>
                
                <form className="form" onSubmit={this.handleSubmit}>

                    
                    <br/>

                    <header className="loginHeader">
                        Login
                        <small>
                            <small>
                                <pre className="loginPrompt">
                                    {this.state.errstate === 0 ? "Please enter your username\nand password." : 
                                    "Incorrect username\nor password."}
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
                    <input type="submit" name="login" value="Log in" />
                    <br/>
                    {"Don't have an account?"}
                    <br/>
                    <button name="register" onClick={this.register} >
                        Register now
                    </button>
                </form>
            </div>
        );
    }
}

export default LoginForm;