import React from 'react';
import $ from 'jquery';
import {Link} from "react-router-dom";
import warrants from '../../config/warrants';
import {newCharacter} from "../../lib/API";

function WarrantDrop() {
    let x = [];
    warrants.forEach(e => {
        x.push(<option key={e}>{e}</option>);
    });
    return x;
}

function WarrantList({warrants, remove}) {
    let x = [];
    warrants.forEach(e => {
        x.push(<tr key={e.info}>
            <td>{e.type}</td>
            <td>{e.info}</td>
            <td><button onClick={() => remove(e)}>Remove</button></td>
        </tr>);
    });
    return x;
}

class NewCharacter extends React.Component {

    constructor(p) {
        super(p);
        this.state = {warrants: [], loading: false};
        this.processNewCharacter = this.processNewCharacter.bind(this);
        this.newWarrant = this.newWarrant.bind(this);
        this.removeWarrant = this.removeWarrant.bind(this);
        this.ls = [];
        this.warrants = {};
    }

    componentDidMount() {
        $('.ui.dropdown')
            .dropdown();
        $('.ui.radio.checkbox')
            .checkbox();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $('.ui.dropdown')
            .dropdown();
        /*$('.ui.radio.checkbox')
            .checkbox();*/
    }

    newWarrant(e) {
        e.preventDefault();
        let info = {type: this.warrants.type.value, info: this.warrants.info.value};
        console.log(info);
        let clone = this.state.warrants.splice(0);
        if(info.info === "") return;
        clone.push(info);
        this.setState({warrants: clone});
        this.warrants.info.value = "";
    }

    processNewCharacter(e) {
        e.preventDefault();
        let character = {
            lname: this.lname.value,
            mname: this.mname.value,
            fname: this.fname.value,
            eye_color: this.eyecolor.value,
            street_addr: this.streetaddr.value,
            city: this.city.value,
            state: this.cstate.value,
            lstatus: this.ls.value,
            warrants: this.state.warrants,
            dob: this.dob.value
        };
        console.log("Character Built", character);
        this.setState({loading: true});
        newCharacter(character).then(e => {
            this.setState({loading: false});
            if(!e.code == null || e.code !== 201) {
                alert('Character was not created. Did you fill everything in?');
                return;
            }
            this.props.history.push("/c/characters");
        });
    }

    removeWarrant(x) {
        let clone = this.state.warrants.splice(0);
        clone.splice(clone.indexOf(x), 1);
        this.setState({warrants: clone});
    }

    render() {
        return <div>
            <h1>New Character</h1>
            <div className={"ui divider"}></div>
            <p>Need a push in the right direction? Might I suggest the <a href={"https://www.fakenamegenerator.com/"} target={"_blank"}>
            Fake Name Generator
            </a>?</p>
            <form className={"ui form" + (this.state.loading ? ' loading' : '')}>
                <div className={"ui grid"}>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Last Name</label>
                            <input type={"text"} ref={(e) => this.lname = e}/>
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Middle Name</label>
                            <input type={"text"} ref={(e) => this.mname = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>First Name</label>
                            <input type={"text"} ref={(e) => this.fname = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Eye Color</label>
                            <select className={"ui dropdown"} ref={(e) => this.eyecolor = e}>
                                <option>BLU</option>
                                <option>GRN</option>
                                <option>HZL</option>
                                <option>GRY</option>
                                <option>BRN</option>
                                <option>BLK</option>
                            </select>
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <div className={"field"}>
                            <label>Street Address</label>
                            <input type={"text"} ref={(e) => this.streetaddr = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>City</label>
                            <input type={"text"} ref={(e) => this.city = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>State</label>
                            <input type={"text"} value={"LS"} ref={(e) => this.cstate = e} disabled />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>License Status</label>
                            <select className={"ui search dropdown"} ref={(e) => this.ls = e}>
                                <option>None</option>
                                <option>Valid</option>
                                <option>Suspended</option>
                                <option>Revoked</option>
                                <option>Expired</option>
                            </select>
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>DOB</label>
                            <input type={"date"} ref={(e) => this.dob = e} />
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <table className={"ui table"}>
                            <thead>
                                <tr>
                                    <th>Warrant</th>
                                    <th>Futher Info</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <WarrantList warrants={this.state.warrants} remove={this.removeWarrant} />
                            </tbody>
                        </table>
                        <div className={"fields"}>
                            <div className={"field"}>
                                <select className={"ui search dropdown"} ref={(e) => this.warrants.type = e}>
                                    <WarrantDrop/>
                                </select>
                            </div>
                            <div className={"field"}>
                                <input type={"text"} placeholder={"Info"} ref={(e) => this.warrants.info = e} />
                            </div>
                            <div className={"field"}>
                                <button className={"ui button"} onClick={this.newWarrant}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={"/c/characters"} className={"ui button"}>
                    Back
                </Link>
                <button className={"black ui button"} onClick={this.processNewCharacter}>
                    Create Character
                </button>
            </form>
        </div>;
    }
}

export default NewCharacter;