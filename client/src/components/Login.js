import React from 'react';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            reg: false,
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

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.reg){
            this.setState({reg: false});
            this.props.setActive('RegistrationForm');
        }
        else{
            // TODO: Validation / data base
            this.props.setActive('Board');
        }
    }

    register() {
        this.setState({reg: true});
    }

    render() {
        return (
            <div className="login-form">
                <form className="form" onSubmit={this.handleSubmit}>
                    <label>
                        {"Username: "}
                        <input name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} />
                    </label>
                    <br/>
                    <label>
                        {"Password:"}
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