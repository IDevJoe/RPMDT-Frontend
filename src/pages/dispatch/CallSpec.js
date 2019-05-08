import React from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {updateCall} from "../../lib/API";
import CallLog from '../../components/CallLog';

class CallSpec extends React.Component {

    constructor(p) {
        super(p);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateCode = this.updateCode.bind(this);
        this.updateSummary = this.updateSummary.bind(this);
    }

    updateCode() {
        updateCall(this.props.match.params.call, {code: this.code.value});
    }

    updateSummary() {
        updateCall(this.props.match.params.call, {summary: this.summary.value});
    }

    updateDescription() {
        updateCall(this.props.match.params.call, {description: this.description.value});
    }

    render() {
        if(this.props.state == null) return null;
        console.log("F", this.props.state);
        let call = this.props.state.calls.find((e) => this.props.match.params.call == e.id);
        if(call == null) return <Redirect to={"/d/dispatch"} push />
        return (
            <div>
                <Link className={"ui labeled icon button"} to={"/d/dispatch"}>
                    <i className={"ui arrow left icon"}> </i>
                    Back to Dispatch
                </Link>
                <div className={"ui grid"} style={{marginTop: "20px"}}>
                    <div className={"eight wide column"}>
                        <div className={"ui form"}>
                            <div className={"ui fields"}>
                                <div className={"ui field"}>
                                    <label>Code</label>
                                    <select ref={(e) => this.code = e} onChange={this.updateCode} defaultValue={call.code} className={"ui search dropdown"}>
                                        <option>Traffic Stop</option>
                                        <option>Pursuit</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className={"ui field"}>
                                    <label>Summary</label>
                                    <input ref={(e) => this.summary = e} onBlur={this.updateSummary} defaultValue={call.summary} type={"text"} maxLength={255} />
                                </div>
                            </div>
                            <div className={"ui field"}>
                                <label>Full Description</label>
                                <textarea style={{width: '100%'}} defaultValue={call.description} onBlur={this.updateDescription} ref={(e) => this.description = e} rows={10}>
                        </textarea>
                            </div>
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <CallLog log={call.log} />
                    </div>
                </div>
            </div>
        )
    }

}

let MSTP = ({state}) => {
    return {state};
};

export default connect(MSTP)(CallSpec);