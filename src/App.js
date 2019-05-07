import React from 'react';
import './App.css';
import {connect} from "react-redux";
import Router from './components/Router';
import LoginForm from './pages/LoginForm'
import {profile, state} from "./lib/API";
import {SET_STATE, SET_USER} from "./reducers";
import {subscribeToPersonal} from "./lib/Pusher";

function Chooser({user}) {
  return (user != null) ? <Router /> : <LoginForm/>;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {init: false};
  }

  componentDidMount() {
    profile().then((d) => {
      this.setState({init: true});
      if(d.code !== 200) return;
      this.props.dispatch({type: SET_USER, user: d.data});
    });
  }

  render() {
    if(this.props.user != null && this.props.state == null) {
      state().then((e) => {
        this.props.dispatch({type: SET_STATE, state: e.data});
      });
    }
    if(!this.state.init) return (
        <div>
          Contacting the server.. If this takes more than 10 seconds, please contact an admin.
        </div>
    );
    return (
        <div className="App">
          <Chooser user={this.props.user}/>
        </div>
    );
  }

}

const MSTP = ({user, state}) => {
  return {user, state};
};

export default connect(MSTP)(App);
