import React from 'react';
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
            // TODO: Validation / data base
            if (this.state.username === '' || this.state.password === ''){
                this.setState({errstate: 0});
            }
            else{
                const userValid = await Axios.get("http://localhost:8000/api/search-user/" + this.state.username)
                console.log(userValid)
                if (userValid.data === ''){
                    this.setState({errstate: 1});
                }
                else{
                    const response = await Axios.get("http://localhost:8000/api/compare-password/" + this.state.username + "/" + this.state.password)
                    console.log(response)
                    if(response.data){
                        this.props.setActive('Board');
                    }
                    else{
                        this.setState({errstate: 2});
                    }
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
                <form className="form" onSubmit={this.handleSubmit}>
                    <header>
                        Login
                        <small>
                            <small>
                                <pre>
                                    {this.state.errstate === 0 ? "Please enter your username\nand password." : 
                                    this.state.errstate === 1 ? "That user does not exist.\nCreate an account." :
                                    "Incorrect password.\nPlease try again."}
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