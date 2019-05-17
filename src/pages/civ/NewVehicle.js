import React from 'react';
import {Link} from "react-router-dom";
import vehicles from '../../config/vehicles';
import $ from 'jquery';
import {connect} from "react-redux";
import {createVehicle} from "../../lib/API";

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

class NewVehicle extends React.Component {

    constructor(p) {
        super(p);
        this.state = {loading: false, make: Object.keys(vehicles)[0]};
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
        this.setState({loading: true});
        let veh = {
            make: this.make.value,
            model: this.model.value,
            color: this.color.value,
            plate: this.plate.value,
            plstatus: this.plstatus.value,
            instatus: this.instatus.value
        };
        createVehicle(this.owner.value, veh).then((e) => {
            this.setState({loading: false});
            if(e.code != 201) {
                alert("The vehicle was not created. Did you fill everything in?");
                return;
            }
            this.props.history.push("/c/vehicles");
        });
    }

    render() {
        return <div>
            <h1>New Vehicle</h1>
            <div className={"ui divider"}></div>
            <form className={"ui form" + (this.state.loading ? ' loading' : '')}>
                <div className={"ui grid"}>
                    <div className={"four wide column field"}>
                        <label>Make</label>
                        <select className={"ui search dropdown"} ref={(e) => this.make = e} onChange={this.makeChanged}>
                            <VehicleMakeList/>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Model</label>
                        <select ref={(e) => this.model = e}>
                            <VehicleModelList make={this.state.make}/>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Color</label>
                        <input type={"text"} ref={(e) => this.color = e} />
                    </div>
                    <div className={"four wide column field"}>
                        <label>Owner</label>
                        <select className={"ui search dropdown"} ref={(e) => this.owner = e}>
                            <OwnerDrop characters={this.props.user.characters} />
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Plate #</label>
                        <input type={"text"} ref={(e) => this.plate = e} />
                    </div>
                    <div className={"four wide column field"}>
                        <label>Plate Status</label>
                        <select className={"ui search dropdown"} ref={(e) => this.plstatus = e}>
                            <option>Valid</option>
                            <option>Stolen</option>
                            <option>Revoked</option>
                            <option>Expired</option>
                        </select>
                    </div>
                    <div className={"four wide column field"}>
                        <label>Insurance Status</label>
                        <select className={"ui search dropdown"} ref={(e) => this.instatus = e}>
                            <option>Insured</option>
                            <option>Uninsured</option>
                        </select>
                    </div>
                </div>
                <Link to={"/c/vehicles"} className={"ui button"}>
                    Back
                </Link>
                <button className={"black ui button"} onClick={this.cv}>
                    Create Vehicle
                </button>
            </form>
        </div>;
    }
}

let MSTP = ({user}) => {
    return {user};
};

export default connect(MSTP)(NewVehicle);