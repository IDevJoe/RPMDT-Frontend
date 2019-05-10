import React from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

function CharacterList({characters}) {
    let x = [];
    characters.forEach(e => {
        x.push(<tr>
            <td>{e.fname} {e.lname}</td>
            <td>{e.lstatus}</td>
            <td>{e.warrants.length}</td>
            <td>0</td>

        </tr>)
    });

    return x;
}

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
                        <th>License Status</th>
                        <th>Warrant Count</th>
                        <th>Vehicle Count</th>
                    </tr>
                </thead>
                <tbody>
                <CharacterList characters={this.props.user.characters} />
                </tbody>
            </table>
        </div>);
    }
}

let MSTP = ({user}) => {
        return {user};
};

export default connect(MSTP)(Characters);