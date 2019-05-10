import {store} from "../../index";
import {SET_STATE} from "../../reducers";
import {cloneState, isCurrentUser} from "../Pusher";

export function RegisterEvents(sock) {
    sock.bind('user.callsignchange', data => {
        if(store.getState().user == null) return;
        let clone = cloneState();
        if(isCurrentUser(data.user.id)) {
            clone.callsign = data.newCallsign;
        } else {
            let unit = clone.police.find((e) => e.id === data.user.id);
            if(unit != null)
                unit.current_callsign = data.newCallsign;
        }
        store.dispatch({type: SET_STATE, state: clone});
    });

    sock.bind('user.statuschange', data => {
        if(store.getState().user == null) return;
        let clone = cloneState();
        if(isCurrentUser(data.user.id)) {
            clone.status = data.newStatus;
        }
        let unit = clone.police.find((e) => e.id === data.user.id);
        if(unit != null)
            unit.status = data.newStatus;
        else
        {
            unit = data.user;
            unit.status = data.newStatus;
            clone.police.push(unit);
        }
        if(unit.status == null) {
            var index = clone.police.indexOf(unit);
            if (index !== -1) clone.police.splice(index, 1);
        }
        store.dispatch({type: SET_STATE, state: clone});
    });
}