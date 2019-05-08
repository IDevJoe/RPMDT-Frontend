import React from 'react';
import Lang from "../lang";
import {attachToCall, setUnitStatus} from "../lib/API";

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
        let b;
        let backColor = "#41eef4";
        if(e.status === "Busy") backColor = "orange";
        if(e.status === "Available") backColor="#98f442";
        x.push(<tr key={e.id} style={{backgroundColor: backColor}}>
            <td>{e.current_callsign.callsign}</td>
            <td><select disabled={e.status === "Busy"} ref={(e) => b = e} value={e.activecall != null ? e.activecall.id : -1} onChange={() => attachToCall(e.id, b.value)}>
                <option value={-1}>Unassigned</option>
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

export default UList;