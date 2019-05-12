import React from 'react';
import {IDLookup} from "../../../lib/API";

function ResultEntries({results, select}) {
    let x = [];
    results.forEach((e) => {
        let dob = new Date(e.dob);
        let triangle = null;
        if(e.lstatus !== "Valid") triangle = "yellow";
        if(e.warrants.length > 0) triangle = "red";
        x.push(<tr>
            <td>{triangle !== null ? <i className={triangle + " exclamation triangle icon"}> </i> : null}{e.fname} {e.lname}</td>
            <td>{dob.getMonth()}/{dob.getDate()}/{dob.getFullYear()}</td>
            <td><button className="ui mini compact labeled right icon button" onClick={(x) => {x.preventDefault(); select(e)}}>
                    <i className="check icon"></i>
                    Select
                </button></td>
        </tr>);
    });
    return x;
}

function SearchResults({results, selectChar}) {
    if(results.length === 0) return null;
    return <div style={{marginTop: "20px"}}>
        <h4>Search Results</h4>
        <table className={"ui simple table"}>
            <thead>
            <tr>
                <th>Full Name</th>
                <th>DOB</th>
                <th>Options</th>
            </tr>
            </thead>
            <tbody>
                <ResultEntries results={results} select={selectChar} />
            </tbody>
        </table>
    </div>
}

function WarrantLi({warrants}) {
    let x = [];
    warrants.forEach((e) => {
        x.push(<li>{e.type} ({e.info})</li>);
    });
    return x;
}

function WarrantInformation({warrants}) {
    return (
        <div className="ui error message">
            <div className="header">
                {warrants.length} Warrant(s):
            </div>
            <ul className="list">
                <WarrantLi warrants={warrants} />
            </ul>
        </div>
    );
}

function CharacterInfo({character}) {
    if(character == null) return null;
    let c = character;
    let dob = new Date(c.dob);
    return <div>
        <h5>{c.fname} {c.mname} {c.lname}</h5>
        <p>
            {c.street_addr}
            <br />{c.city}, {c.state}
        </p>
        <p>
            <strong>DOB:</strong> {dob.getMonth()}/{dob.getDate()}/{dob.getFullYear()}
            <br /><strong>Eye Color:</strong> {c.eye_color}
            <br /><strong>License Status:</strong> {c.lstatus} {c.lstatus !== "Valid" ? <i className="red exclamation triangle icon"> </i> : null}
        </p>
        {character.warrants.length > 0 ? <p><WarrantInformation warrants={character.warrants} /></p> : null}
    </div>
}

class CharacterLookup extends React.Component {

    constructor(p) {
        super(p);
        this.state = {loadNames: false, characters: [], selectedCharacter: null};
        this.beginLookup = this.beginLookup.bind(this);
        this.selectChar = this.selectChar.bind(this);
    }

    beginLookup(e) {
        if(e.keyCode !== 13) return;
        e.preventDefault();
        this.setState({loadNames: true});
        IDLookup(this.lname.value).then(data => {
            this.setState({loadNames: false, characters: data.data});
        });
    }

    selectChar(e) {
        this.setState({selectedCharacter: e});
    }

    render() {
        return (<div>
            <h1>ID Lookup</h1>
            <div className={"ui divider"}> </div>
            <div className={"ui grid"}>
                <div className={"eight wide column"}>
                    <div className={"ui icon input" + (this.state.loadNames ? ' loading' : '')}>
                        <input type="text" disabled={this.loadNames} onKeyDown={this.beginLookup} ref={(e) => this.lname = e} placeholder="Last Name" />
                            <i className="search icon"> </i>
                    </div>
                    <SearchResults results={this.state.characters} selectChar={this.selectChar} />
                </div>
                <div className={"eight wide column"}>
                    <CharacterInfo character={this.state.selectedCharacter} />
                </div>
            </div>
        </div>)
    }

}

export default CharacterLookup;