import React from 'react';
import {Link} from "react-router-dom";

class Vehicles extends React.Component {

    constructor(p) {
        super(p);
    }

    render() {
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
            </table>
        </div>);
    }

}

export default Vehicles;