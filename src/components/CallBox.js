import React from 'react';

function CallBox({call}) {
    if(call == null) return null;
    return (
        <div>
            <div className={"ui horizontal divider"}>Active Call</div>
            <div className={"ui grid"}>
                <div className={"eight wide column"}>
                    <h3><span className={"ui label"}>#{call.id}</span> <span className={"blue ui label"}>{call.code}</span> { call.summary }</h3>
                        <textarea readOnly={true} style={{width: '100%'}} value={call.description} rows={10}>
                        </textarea>
                </div>
                <div className={"eight wide column"}>

                </div>
            </div>
        </div>
    );
}

export default CallBox;