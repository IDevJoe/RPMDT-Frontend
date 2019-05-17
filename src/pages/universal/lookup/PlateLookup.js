import React from 'react';
import {IDLookup, lookupPlate} from "../../../lib/API";

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

function PlateInfo({p}) {
    if(p == null) return null;
    return <div>
        <h5>{p.make} {p.model} ({p.plate})</h5>
        <p>
            <strong>Owner:</strong> {p.character.fname} {p.character.lname}
            <br /><strong>Color:</strong> {p.color}
        </p>
    </div>
}

class PlateLookup extends React.Component {

    constructor(p) {
        super(p);
        this.state = {load: false, selectedPlate: null};
        this.beginLookup = this.beginLookup.bind(this);
    }

    beginLookup(e) {
        if(e.keyCode !== 13) return;
        e.preventDefault();
        this.setState({load: true});
        lookupPlate(this.pl.value).then(data => {
            this.setState({load: false});
            if(data.code != 200) {
                alert("Plate not found or registered.");
                return;
            }
            this.setState({selectedPlate: data.data});
        });
    }

    render() {
        return (<div>
            <h1>Plate Lookup</h1>
            <div className={"ui divider"}> </div>
            <div className={"ui grid"}>
                <div className={"eight wide column"}>
                    <div className={"ui icon input" + (this.state.load ? ' loading' : '')}>
                        <input type="text" disabled={this.state.load} onKeyDown={this.beginLookup} ref={(e) => this.pl = e} placeholder="Plate Number" />
                            <i className="search icon"> </i>
                    </div>
                </div>
                <div className={"eight wide column"}>
                    <PlateInfo p={this.state.selectedPlate} />
                </div>
            </div>
        </div>)
    }

}

export default PlateLookup;