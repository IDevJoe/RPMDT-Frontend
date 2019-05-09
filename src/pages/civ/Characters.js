import React from 'react';
import {Link} from "react-router-dom";

class Characters extends React.Component {
    render() {
        return (<div>
            <h1>Characters</h1>
            <div className={"ui divider"}></div>
            <Link to={"/c/characters/new"} className={"ui icon labeled button"}>
                <i className={"user plus icon"}></i>
                New Character
            </Link>
            <table className={"ui table"}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Suspended?</th>
                        <th>Warrant Count</th>
                        <th>DL Number</th>
                        <th>Vehicle Count</th>
                    </tr>
                </thead>
            </table>
        </div>);
    }
}

export default Characters;