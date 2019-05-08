import React from 'react';
import {connect} from "react-redux";
import {changeStatus, detachFromCall, setCallsign} from "../../lib/API";
import CallBox from '../../components/CallBox';

function CallsignSelect({callsigns}) {
    let x = [];
    callsigns.forEach((e) => {
        x.push(<option key={e.id} value={e.id}>{e.callsign}</option>);
    });
    return x;
}

class Patrol extends React.Component {

    constructor(props) {
        super(props);
        this.changeCallsign = this.changeCallsign.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.state != null && this.props.state.callsign == null) {
            if(this.props.user.callsigns.length === 0) {
                alert("You can't patrol.");
            } else {
                setCallsign(this.props.user.callsigns[0].id);
            }
        }
    }

    changeCallsign(e) {
        setCallsign(this.callsignDrop.value);
    }

    render() {
        if(this.props.state == null) return null;
        let status = this.props.state.status;
        return (
            <div>
                <div className={"ui grid"}>
                    <div className={"ui eight wide column"}>
                        <div className={"ui form"}>
                            <div className={"field"}>
                                <label>Status</label>
                                <div className={"ui buttons"}>
                                    <button disabled={this.props.state.active_call != null || this.props.state.callsign == null} className={"ui button" + (status == null ? " active" : "")} onClick={() => changeStatus(null)}>Off-Duty</button>
                                    <button disabled={this.props.state.active_call != null || this.props.state.callsign == null} className={"ui button" + (status === "Busy" ? " active" : "")} onClick={() => changeStatus("Busy")}>Busy</button>
                                    <button disabled={this.props.state.active_call != null || this.props.state.callsign == null} className={"ui button" + (status === "Available" ? " active" : "")} onClick={() => changeStatus("Available")}>Available</button>
                                </div>
                                <div className={"ui buttons"} style={{marginTop: "10px"}}>
                                    <button disabled={this.props.state.active_call == null} className={"ui button" + (status === "Attached" ? " active" : "")} onClick={() => changeStatus("Attached")}>Attached</button>
                                    <button disabled={this.props.state.active_call == null} className={"ui button" + (status === "Enroute" ? " active" : "")} onClick={() => changeStatus("Enroute")}>Enroute</button>
                                    <button disabled={this.props.state.active_call == null} className={"ui button" + (status === "On Scene" ? " active" : "")} onClick={() => changeStatus("On Scene")}>On Scene</button>
                                    <button disabled={this.props.state.active_call == null} className={"red ui button"} onClick={() => detachFromCall()}>Detach</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"ui eight wide column"}>
                        <div className={"ui form"}>
                            <div className={"field"}>
                                <label>Callsign</label>
                                <select className={"ui search dropdown"} defaultValue={this.props.state.callsign != null ? this.props.state.callsign.id : null}
                                        onChange={this.changeCallsign} ref={(e) => {this.callsignDrop = e;}}>
                                    <CallsignSelect callsigns={this.props.user.callsigns} />
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <CallBox call={this.props.state.active_call} />
            </div>
        )
    }

}

let MSTP = ({state, user}) => {
    return {state, user};
};

export default connect(MSTP)(Patrol);