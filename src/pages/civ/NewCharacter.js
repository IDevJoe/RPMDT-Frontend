import React from 'react';
import $ from 'jquery';
import {Link} from "react-router-dom";

class NewCharacter extends React.Component {

    componentDidMount() {
        $('.ui.dropdown')
            .dropdown();
        $('.ui.radio.checkbox')
            .checkbox();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        $('.ui.dropdown')
            .dropdown();
        $('.ui.radio.checkbox')
            .checkbox();
    }

    render() {
        return <div>
            <h1>New Character</h1>
            <div className={"ui divider"}></div>
            <form className={"ui form"}>
                <div className={"ui grid"}>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Last Name</label>
                            <input type={"text"} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Middle Name</label>
                            <input type={"text"} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>First Name</label>
                            <input type={"text"} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>Eye Color</label>
                            <select className={"ui dropdown"}>
                                <option>BLU</option>
                                <option>GRN</option>
                                <option>HZL</option>
                                <option>GRY</option>
                                <option>BRN</option>
                                <option>BLK</option>
                            </select>
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <div className={"field"}>
                            <label>Street Address</label>
                            <input type={"text"} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>City</label>
                            <input type={"text"} />
                        </div>
                    </div>
                    <div className={"four wide column"}>
                        <div className={"field"}>
                            <label>State</label>
                            <input type={"text"} value={"LS"} disabled />
                        </div>
                    </div>
                    <div className={"eight wide column"}>
                        <div className={"inline fields"}>
                            <label>License Status</label>
                            <div className={"field"}>
                                <div className="ui radio checkbox">
                                    <input type="radio" name={"ls"} checked="" tabIndex="0" className="hidden" />
                                    <label>No License</label>
                                </div>
                            </div>
                            <div className={"field"}>
                                <div className="ui radio checkbox">
                                    <input type="radio" name={"ls"} checked="" tabIndex="0" className="hidden" />
                                    <label>Valid</label>
                                </div>
                            </div>
                            <div className={"field"}>
                                <div className="ui radio checkbox">
                                    <input type="radio" name={"ls"} checked="" tabIndex="0" className="hidden" />
                                    <label>Suspended</label>
                                </div>
                            </div>
                            <div className={"field"}>
                                <div className="ui radio checkbox">
                                    <input type="radio" name={"ls"} checked="" tabIndex="0" className="hidden" />
                                    <label>Expired</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={"/c/characters"} className={"ui icon labeled button"}>
                    <i className={"ui left arrow icon"}>

                    </i>
                    Back
                </Link>
            </form>
        </div>;
    }
}

export default NewCharacter;