import React from 'react';
import {connect} from "react-redux";

function UnitList({units}) {
    let x = [];
    units.forEach((e) => {
        x.push(<tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.current_callsign.callsign}</td>
            <td>{e.status}</td>
        </tr>)
    });
    return x;
}

function CallList({calls}) {
    let x = [];
    calls.forEach((e) => {
        x.push(<tr key={e.id}>
            <td>{e.id}</td>
            <td>{e.summary}</td>
            <td>{e.code}</td>
            <td>{e.units.length}</td>
            <td></td>
        </tr>)
    });
    return x;
}

class PrePatrol extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if(this.props.state == null) return null;
        return (
            <div>
                <h1>Pre-Patrol</h1>
                <div className={"ui divider"}> </div>
                <div className={"ui grid"}>
                    <div className={"ui eight wide column"}>
                        <h5>Online Units</h5>
                        <table className={"ui table"}>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Callsign</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                                <UnitList units={this.props.state.police} />
                            </tbody>
                        </table>
                    </div>
                    <div className={"ui eight wide column"}>
                        <h5>Active Calls</h5>
                        <table className={"ui table"}>
                            <thead>
                            <tr>
                                <th>Call Number</th>
                                <th>Summary</th>
                                <th>10-Code</th>
                                <th>Units Attached</th>
                                <th>Flags</th>
                            </tr>
                            </thead>
                            <tbody>
                            <CallList calls={this.props.state.calls} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

let MSTP = ({state}) => {
    return {state};
};

export default connect(MSTP)(PrePatrol);