import React from 'react';
import {connect} from "react-redux";
import {login} from "../lib/API";
import {SET_USER} from "../reducers";
import {subscribeToPersonal} from "../lib/Pusher";

function RedMessage({message}) {
    return (<div className="ui error message">
        <div className="header">
            An error occurred while logging you in.
        </div>
        { message }
    </div>);
}

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: false, error: null};
        this.email = null;
        this.password = null;
        this.Login = this.Login.bind(this);
    }

    Login(e,) {
        e.preventDefault();
        this.setState({loading: true});
        login(this.email.value, this.password.value).then(data => {
            if(data.code !== 200) {
                this.setState({loading: false, error: "Invalid username or password."});
                return;
            }
            localStorage.token = data.data.token;
            this.props.dispatch({type: SET_USER, user: data.data.user});
        });
    }

    render() {
        return (
            <div className={"ui container"} style={{marginTop: '50px'}}>
                { this.state.error != null ? <RedMessage message={this.state.error} /> : null}
                <form className="ui form">
                    <h4 className="ui dividing header">Login to MDT</h4>
                    <div className="field">
                        <div className="two fields">
                            <div className="field">
                                <label>Email Address</label>
                                <input type="email" ref={(x) => this.email = x} />
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input type="password" ref={(x) => this.password = x} />
                            </div>
                        </div>
                    </div>
                    <button className={"ui black button" + (this.state.loading ? ' loading' : '')} onClick={(e) => this.Login(e, this.props.dispatch)}>Login</button>
                </form>
            </div>
        )
    }

}

export default connect()(LoginForm);