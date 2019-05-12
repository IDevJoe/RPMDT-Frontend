import React from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {delCharacter} from "../../lib/API";

function CharacterList({characters, del}) {
    let x = [];
    characters.forEach(e => {
        x.push(<tr key={e.id}>
            <td>{e.fname} {e.lname}</td>
            <td>{e.lstatus}</td>
            <td>{e.warrants.length}</td>
            <td>0</td>
            <td><button className="ui mini basic button" onClick={() => del(e)}>
                <i className="icon trash"> </i>
                Delete
            </button>
                <Link to={"/c/characters/spec/" + e.id} className="ui mini basic button">
                    <i className="icon file"> </i>
                    View
                </Link></td>
        </tr>)
    });

    return x;
}

class Characters extends React.Component {
    delCharacter(e) {
        if(window.confirm("Really delete " + e.fname + " " + e.lname + "?")) {
            delCharacter(e.id);
        }
    }

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
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                <CharacterList characters={this.props.user.characters} del={this.delCharacter} />
                </tbody>
            </table>
        </div>);
    }
}

let MSTP = ({user}) => {
        return {user};
};

export default connect(MSTP)(Characters);