import React from 'react';
import {Link} from "react-router-dom";
import vehicles from '../../config/vehicles';
import $ from 'jquery';
import {connect} from "react-redux";
import {createVehicle, editVehicle} from "../../lib/API";

function VehicleMakeList() {
    let x = [];
    Object.keys(vehicles).forEach(e => {
        x.push(<option key={e}>{e}</option>);
    });
    return x;
}

function VehicleModelList({make}) {
    let x = [];
    vehicles[make].forEach(e => {
        x.push(<option key={make + e}>{e}</option>);
    });
    return x;
}

function OwnerDrop({characters}) {
    let x = [];
    characters.forEach(e => {
        x.push(<option key={e.id} value={e.id}>{e.fname} {e.lname}</option>);
    });
    return x;
}

function compileVehicles(characters) {
    let vehs = [];
    characters.forEach((e) => {
        let b = {};
        Object.assign(b, e);
        delete b.vehicles;
        e.vehicles.forEach(ee => {
            let a = {};
            Object.assign(a, ee);
            a.character = b;
            vehs.push(a);
        });
    });
    return vehs;
}

class EditVehicle extends React.Component {

    constructor(p) {
        super(p);
        let veh = compileVehicles(p.user.characters).find(e => e.id == p.match.params.id);
        this.state = {loading: false, make: veh.make};
        this.makeChanged = this.makeChanged.bind(this);
        this.cv = this.cv.bind(this);
    }

    regenerateDrops() {
        $(".ui.dropdown").dropdown();
    }

    componentDidMount() {
        this.regenerateDrops();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.regenerateDrops();
    }

    makeChanged() {
        this.setState({make: this.make.value});
    }

    cv(e) {
        e.preventDefault();
        let veha = compileVehicles(this.props.user.characters).find(e => e.id == this.props.match.params.id);
        this.setState({loading: true});
        let veh = {
            make: this.make.value,
            model: this.model.value,
            color: this.color.value,
            plate: this.plate.value,
            plstatus: this.plstatus.value,
            instatus: this.instatus.value
        };
        editVehicle(veha.id, veh).then((e) => {
            this.setState({loading: false});
            if(e != null) {
                alert("A server error occurred.");
                return;
            }
            alert("Vehicle Updated");
        });
    }

    render() {
        let veh = compileVehicles(this.props.user.characters).find(e => e.id == this.props.match.params.id);
        return <div>
            <h1>Update Vehicle</h1>
            <div className={"ui divider"}></div>
            <form className={"ui form" + (this.state.loading ? ' loading' : '')}>
                <div className={"ui grid"}>
                    <div className={"four wide column field"}>
                        <label>Make</label>
                        <select defaultValue={veh.make} className={"ui search dropdown"} ref={(e) => this.make = e} onChange={this.makeChanged}>
                            <VehicleMakeList/>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Model</label>
                        <select defaultValue={veh.model} ref={(e) => this.model = e}>
                            <VehicleModelList make={this.state.make}/>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Color</label>
                        <input defaultValue={veh.color} type={"text"} ref={(e) => this.color = e} />
                    </div>
                    <div className={"four wide column field"}>
                        <label>Owner</label>
                        <select defaultValue={veh.character.id} className={"ui search dropdown"} ref={(e) => this.owner = e}>
                            <OwnerDrop characters={this.props.user.characters} />
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Plate #</label>
                        <input defaultValue={veh.plate} type={"text"} ref={(e) => this.plate = e} />
                    </div>
                    <div className={"four wide column field"}>
                        <label>Plate Status</label>
                        <select className={"ui search dropdown"} defaultValue={veh.plstatus} ref={(e) => this.plstatus = e}>
                            <option>Valid</option>
                            <option>Stolen</option>
                            <option>Revoked</option>
                            <option>Expired</option>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Insurance Status</label>
                        <select className={"ui search dropdown"} defaultValue={veh.instatus} ref={(e) => this.instatus = e}>
                            <option>Insured</option>
                            <option>Uninsured</option>
                        </select>
                    </div>
                </div>
                <Link to={"/c/vehicles"} className={"ui button"}>
                    Back
                </Link>
                <button className={"black ui button"} onClick={this.cv}>
                    Edit Vehicle
                </button>
            </form>
        </div>;
    }
}

let MSTP = ({user}) => {
    return {user};
};

export default connect(MSTP)(EditVehicle);