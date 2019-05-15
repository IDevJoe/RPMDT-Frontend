import React from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

function VehicleList({vehicles}) {
    let x = [];
    vehicles.forEach((e) => {
        x.push(<tr key={e.id}>
            <td>{e.make}</td>
            <td>{e.model}</td>
            <td>{e.plate}</td>
            <td>{e.character.fname} {e.character.lname}</td>
            <td><button className="ui mini basic button">
                <i className="icon trash"> </i>
                Delete
            </button>
                <Link to={"/c/vehicles/spec/" + e.id} className="ui mini basic button">
                    <i className="icon file"> </i>
                    View
                </Link></td>
        </tr>)
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

class Vehicles extends React.Component {

    constructor(p) {
        super(p);
    }

    render() {
        let vehs = compileVehicles(this.props.user.characters);
        return (<div>
            <h1>Vehicles</h1>
            <div className={"ui divider"}> </div>
            <Link to={"/c/vehicles/new"} className={"ui icon labeled button"}>
                <i className={"car icon"}></i>
                New Vehicle
            </Link>
            <table className={"ui table"}>
                <thead>
                    <tr>
                        <th>Make</th>
                        <th>Model</th>
                        <th>License Plate</th>
                        <th>Vehicle Owner</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    <VehicleList vehicles={vehs} />
                </tbody>
            </table>
        </div>);
    }

}

let MSTP = ({user}) => {
    return {user};
};

export default connect(MSTP)(Vehicles);