import React from 'react';

function EventList({events}) {
    let x = [];
    events.forEach((e) => {
        let date = new Date(e.created_at);
        x.push(<div className="event">
            <div className="label">
                <i className={LogIcons[e.type] + " icon"}> </i>
            </div>
            <div className="content">
                <div className="summary">
                    {e.message}
                    <div className="date">{date.getUTCHours()}:{date.getUTCMinutes()}:{date.getUTCSeconds()}</div>
                </div>
            </div>
        </div>);
    });
    return x;
}

let LogIcons = {
    TYPE_CALL_ASSIGN: "user plus",
    TYPE_CALL_ARCHIVE: "archive",
    TYPE_CALL_DETACH: "user times",
    TYPE_CALL_UPDATE: "pencil alternate",
    TYPE_UNIT_STATUSCHANGE: "car"
};

class CallLog extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        return (<div>
            <div className="ui feed" style={{height: "400px", overflowY: "scroll"}}>
                <EventList events={this.props.log} />
                <div style={{ float:"left", clear: "both" }}
                     ref={(el) => { this.messagesEnd = el; }}> </div>
            </div>
        </div>);
    }

}

export default CallLog;