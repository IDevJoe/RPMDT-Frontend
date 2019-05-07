import React from 'react';
import {connect} from "react-redux";
import Lang from '../../lang';

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
        let LangSpec = Lang.POLICE.PRE_PATROL;
        if(this.props.state == null) return null;
        return (
            <div>
                <h1>{LangSpec.NAME}</h1>
                <div className={"ui divider"}> </div>
                <div className={"ui grid"}>
                    <div className={"ui eight wide column"}>
                        <h5>{LangSpec.ONLINE_UNITS}</h5>
                        <table className={"ui table"}>
                            <thead>
                            <tr>
                                <th>{LangSpec.UNIT_NAME}</th>
                                <th>{LangSpec.UNIT_CALLSIGN}</th>
                                <th>{LangSpec.UNIT_STATUS}</th>
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
                                <th>{LangSpec.CALL_NUMBER}</th>
                                <th>{LangSpec.CALL_SUMMARY}</th>
                                <th>{LangSpec.CALL_CODE}</th>
                                <th>{LangSpec.CALL_ATTACHED_COUNT}</th>
                                <th>{LangSpec.CALL_FLAGS}</th>
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