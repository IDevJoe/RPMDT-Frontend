import React from 'react';
import {Link} from "react-router-dom";
import vehicles from '../../config/vehicles';
import $ from 'jquery';
import {connect} from "react-redux";

function VehicleMakeList() {
    let x = [];
    Object.keys(vehicles).forEach(e => {
        x.push(<option>{e}</option>);
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

    render() {
        return <div>
            <h1>New Vehicle</h1>
            <div className={"ui divider"}></div>
            <form className={"ui form" + (this.state.loading ? ' loading' : '')}>
                <div className={"fields"}>
                    <div className={"field"}>
                        <label>Make</label>
                        <select className={"ui search dropdown"} ref={(e) => this.make = e} onChange={this.makeChanged}>
                            <VehicleMakeList/>
                        </select>
                    </div>
                    <div className={"field"}>
                        <label>Model</label>
                        <select>
                            <VehicleModelList make={this.state.make}/>
                        </select>
                    </div>
                    <div className={"field"}>
                        <label>Owner</label>
                        <select className={"ui search dropdown"}>
                            <OwnerDrop characters={this.props.user.characters} />
                        </select>
                    </div>
                    <div className={"field"}>
                        <label>Plate #</label>
                        <input type={"text"} />
                    </div>
                </div>
                <Link to={"/c/vehicles"} className={"ui button"}>
                    Back
                </Link>
                <button className={"black ui button"}>
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