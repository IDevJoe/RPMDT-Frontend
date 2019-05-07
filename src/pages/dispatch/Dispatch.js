import React from 'react';
import {connect} from "react-redux";
import Lang from '../../lang';
import {setUnitStatus} from "../../lib/API";

function CallBoard({calls}) {
    let x = [];
    calls.forEach((e) => {
        x.push(<tr key={e.id}>
            <td>{e.code}</td>
            <td>{e.summary}</td>
            <td>{e.units.length}</td>
        </tr>)
    });
    return x;
}

function CallDrop({calls}) {
    let x = [];
    calls.forEach((e) => {
        x.push(<option key={e.id} value={e.id}>{e.id} - {e.summary}</option>)
    });
    return x;
}

function UList({state, dispatch}) {
    let x = [];
    let lang = Lang.STATUSES;
    state.police.forEach((e) => {
        let a;
        let backColor = "#41eef4";
        if(e.status === "Busy") backColor = "orange";
        if(e.status === "Available") backColor="#98f442";
        x.push(<tr key={e.id} style={{backgroundColor: backColor}}>
            <td>{e.current_callsign.callsign}</td>
            <td><select value={e.activecall != null ? e.activecall.id : null}>
                <CallDrop calls={state.calls} />
            </select></td>
            <td><select value={e.status} ref={(e) => a = e} onChange={() => {setUnitStatus(e.id, a.value)}}>
                <option value={"Off-Duty"} disabled={e.activecall != null}>{lang.OFFDUTY}</option>
                <option value={"Busy"} disabled={e.activecall != null}>{lang.BUSY}</option>
                <option value={"Available"} disabled={e.activecall != null}>{lang.AVAILABLE}</option>
                <option value={"Attached"} disabled={e.activecall == null}>{lang.ATTACHED}</option>
                <option value={"Enroute"} disabled={e.activecall == null}>{lang.ENROUTE}</option>
                <option value={"On Scene"} disabled={e.activecall == null}>{lang.ONSCENE}</option>
            </select></td>
        </tr>)
    });
    return x;
}

class Dispatch extends React.Component {

    render() {
        if(this.props.state == null) return null;
        return (
            <div>
                <h5>Call Board</h5>
                <table className={"ui very basic table"}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Summary</th>
                            <th>Primary Unit</th>
                            <th>Attached</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CallBoard calls={this.props.state.calls} />
                    </tbody>
                </table>
                <div className={"ui grid"} style={{marginTop: '20px'}}>
                    <div className={"eight wide column"}>
                        <div className={"ui segment"}>
                            <span className={"ui ribbon label"}>Unit List</span>
                            <table className={"ui very basic center aligned table"}>
                                <thead>
                                <tr>
                                    <th>Callsign</th>
                                    <th>Call</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <DynamicUList />
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <h5>New Call</h5>
                    </div>
                </div>
            </div>
        )
    }
}

let MSTP = ({state}) => {
    return {state};
};
let DynamicUList = connect(MSTP)(UList);

export default connect(MSTP)(Dispatch);