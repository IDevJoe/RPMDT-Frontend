import React from 'react';
import $ from 'jquery';
import {Link} from "react-router-dom";
import warrants from '../../config/warrants';
import {createWarrant, deleteWarrant, newCharacter, updateCharacter} from "../../lib/API";
import {connect} from "react-redux";

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
            <td><button onClick={(x) => {x.preventDefault(); remove(e);}}>Remove</button></td>
        </tr>);
    });
    return x;
}

class EditCharacter extends React.Component {

    constructor(p) {
        super(p);
        let character = this.props.user.characters.find((e) => e.id == this.props.match.params.id);
        this.state = {loading: false};
        this.updateCharacter = this.updateCharacter.bind(this);
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
        let ch = this.props.user.characters.find((e) => e.id == this.props.match.params.id);
        let info = {type: this.warrants.type.value, info: this.warrants.info.value};
        console.log(info);
        if(info.info === "") return;
        createWarrant(ch.id, info);
        this.warrants.info.value = "";
    }

    updateCharacter(e) {
        e.preventDefault();
        let ch = this.props.user.characters.find((e) => e.id == this.props.match.params.id);
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
        updateCharacter(ch.id, character).then(e => {
            this.setState({loading: false});
            if(e != null) {
                alert('Character was not created. Did you fill everything in?');
                return;
            }
            alert("Character Updated")
        });
    }

    removeWarrant(x) {
        deleteWarrant(x.id);
    }

    render() {
        let character = this.props.user.characters.find((e) => e.id == this.props.match.params.id);
        return <div>
            <h1>Update Character</h1>
            <div className={"ui divider"}></div>
            <form className={"ui form"}>
                <div className={"ui grid"}>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Last Name</label>
                            <input type={"text"} defaultValue={character.lname} ref={(e) => this.lname = e}/>
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Middle Name</label>
                            <input type={"text"} defaultValue={character.mname} ref={(e) => this.mname = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>First Name</label>
                            <input type={"text"} defaultValue={character.fname} ref={(e) => this.fname = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Eye Color</label>
                            <select className={"ui dropdown"} defaultValue={character.eye_color} ref={(e) => this.eyecolor = e}>
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
                            <input type={"text"} defaultValue={character.street_addr} ref={(e) => this.streetaddr = e} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>City</label>
                            <input type={"text"} defaultValue={character.city} ref={(e) => this.city = e} />
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
                            <select className={"ui search dropdown"} defaultValue={character.lstatus} ref={(e) => this.ls = e}>
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
                            <input type={"date"} defaultValue={character.dob} ref={(e) => this.dob = e} />
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
                                <WarrantList warrants={character.warrants} remove={this.removeWarrant} />
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
                <button className={"black ui button" + (this.state.loading ? ' loading' : '')} onClick={this.updateCharacter}>
                    Update Character
                </button>
            </form>
        </div>;
    }
}

let MSTP = ({user}) => {
    return {user};
};

export default connect(MSTP)(EditCharacter);