import React from 'react';
import {connect} from "react-redux";
import Lang from '../../lang';
import {archiveCall, attachToCall, createCall, setUnitStatus} from "../../lib/API";
import $ from 'jquery';
import UList from '../../components/UnitList';

function confirmBeforeArchive(id) {
    if(window.confirm("Are you sure you want to archive #" + id + "?")) {
        archiveCall(id);
    }
}

function CallBoard({calls, history}) {
    let x = [];
    calls.forEach((e) => {
        x.push(<tr key={e.id}>
            <td>{e.code}</td>
            <td>{e.summary}</td>
            <td>{e.primary.current_callsign.callsign}</td>
            <td>{e.units.length}</td>
            <td>
                <button className="ui mini basic button" onClick={() => confirmBeforeArchive(e.id)}>
                    <i className="icon archive"> </i>
                    Archive
                </button>
                <button className="ui mini basic button" onClick={() => history.push('/d/call/' + e.id)}>
                    <i className="icon file"> </i>
                    View
                </button>
            </td>
        </tr>)
    });
    return x;
}

function UnitDrop({units}) {
    let x = [];
    units.forEach((e) => {
        x.push(<option key={e.id} value={e.id}>{e.current_callsign.callsign} - {e.name}</option>)
    });
    return x;
}

class Dispatch extends React.Component {

    constructor(p) {
        super(p);
        this.state = {create_loading: false};
        this.createButton = this.createButton.bind(this);
    }

    componentDidMount() {
        $('.ui.dropdown')
            .dropdown();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $('.ui.dropdown')
            .dropdown();
    }

    createButton(e) {
        e.preventDefault();
        this.setState({create_loading: true});
        createCall(this.create_code.value, this.create_summary.value, this.create_primary.value, this.create_desc.value).then(e => {
            this.setState({create_loading: false});
            if(e.code !== 201) {
                alert("Call could not be created.");
                return;
            }
            this.create_desc.value = "";
            this.create_primary.value = "";
            this.create_code.value = "";
            this.create_summary.value = "";
        });
    }

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
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CallBoard calls={this.props.state.calls} history={this.props.history} />
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
                        <div className={"ui segment"}>
                            <span className={"ui ribbon label"}>New Call</span>
                            <div className={"ui form"}>
                                <div className={"ui fields"}>
                                    <div className={"ui field"}>
                                        <label>Code</label>
                                        <select ref={(e) => this.create_code = e} className={"ui search dropdown"}>
                                            <option>Traffic Stop</option>
                                            <option>Pursuit</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className={"ui field"}>
                                        <label>Summary</label>
                                        <input ref={(e) => this.create_summary = e} type={"text"} maxLength={255} />
                                    </div>
                                </div>
                                <div className={"ui field"}>
                                    <label>Full Description</label>
                                    <textarea ref={(e) => this.create_desc = e}>

                                    </textarea>
                                </div>
                                <div className={"ui field"}>
                                    <label>Primary Unit</label>
                                    <select ref={(e) => this.create_primary = e}>
                                        <UnitDrop units={this.props.state.police.filter((e) => e.status === "Available")} />
                                    </select>
                                </div>
                                <button onClick={this.createButton} className={"black ui button" + (this.state.create_loading ? ' loading' : '')}>Create</button>
                            </div>
                        </div>
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