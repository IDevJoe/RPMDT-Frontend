import React from 'react';
import {BrowserRouter as Router, Route, Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {SET_USER} from "../reducers";

import Police_Pre from '../pages/police/PrePatrol';
import Police_Patrol from '../pages/police/Patrol';

import Dispatch from '../pages/dispatch/Dispatch';
import Dispatch_Call from '../pages/dispatch/CallSpec';

import Civ_Characters from '../pages/civ/Characters';
import Civ_NewC from '../pages/civ/NewCharacter';
import Civ_EditC from '../pages/civ/EditCharacter';

function AppRouter({user, dispatch}) {
    return (
        <Router>
            <div className="ui fixed visible sidebar inverted vertical menu" id={"main_nav"}>
                <NavLink to={"/"} exact className={"item"}>Home</NavLink>
                <div className={"item"}>
                    <div className={"header"}>Police</div>
                    <div className={"menu"}>
                        <NavLink to={"/p/pre"} className="item">
                            Pre-Patrol
                        </NavLink>
                        <NavLink to={"/p/patrol"} className="item">
                            Patrol
                        </NavLink>
                        <NavLink to={"/p/plate"} className="item">
                            License Plate Lookup
                        </NavLink>
                        <NavLink to={"/p/id"} className={"item"}>
                            ID Lookup
                        </NavLink>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"header"}>Fire/EMS</div>
                    <div className={"menu"}>
                        <NavLink to={"/f/patrol"} className="item">
                            Patrol
                        </NavLink>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"header"}>Civilian</div>
                    <div className={"menu"}>
                        <NavLink to={"/c/characters"} className="item">
                            Characters
                        </NavLink>
                        <NavLink to={"/c/vehicles"} className="item">
                            Vehicles
                        </NavLink>
                    </div>
                </div>
                <div className={"item"}>
                    <div className={"header"}>Dispatching</div>
                    <div className={"menu"}>
                        <NavLink to={"/d/dispatch"} className="item">
                            Dispatch
                        </NavLink>
                        <NavLink to={"/d/plate"} className="item">
                            License Plate Lookup
                        </NavLink>
                        <NavLink to={"/d/id"} className="item">
                            ID Lookup
                        </NavLink>
                    </div>
                </div>
                <a href={"#a"} className={"item"} onClick={(e) => {e.preventDefault(); delete localStorage.token; dispatch({type: SET_USER, user: null})}}>
                    Logout
                </a>
            </div>
            <div className="pusher" id={"navpusher"}>
                <div className={"ui container"}>
                    <Route path={"/p/pre"} component={Police_Pre} />
                    <Route path={"/p/patrol"} component={Police_Patrol} />

                    <Route path={"/d/dispatch"} component={Dispatch} />
                    <Route path={"/d/call/:call"} component={Dispatch_Call} />

                    <Route path={"/c/characters"} exact component={Civ_Characters} />
                    <Route path={"/c/characters/new"} component={Civ_NewC} />
                    <Route path={"/c/characters/spec/:id"} component={Civ_EditC} />
                </div>
            </div>
        </Router>
    )
}

let MSTP = ({user}) => {
    return {user};
};

export default connect(MSTP)(AppRouter);