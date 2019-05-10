import {store} from "../../index";
import {SET_STATE} from "../../reducers";
import attachS from "../../sound/attach.mp3";
import {cloneState} from "../Pusher";
import {isCurrentUser} from "../Pusher";

let attachSound = new Audio(attachS);

function handleDetach(unit) {
    if(store.getState().user == null) return;
    let clone = cloneState();
    let sunit = clone.police.find((e) => e.id === unit.id);
    let call = clone.calls.find((e) => e.id === sunit.activecall.id);
    if(call != null) {
        let unit2 = call.units.find((e) => e.id === sunit.id);
        var index = call.units.indexOf(unit2);
        if (index !== -1) call.units.splice(index, 1);
    }
    sunit.activecall = null;
    if(isCurrentUser(unit.id)) clone.active_call = null;
    store.dispatch({type: SET_STATE, state: clone});
}

export function RegisterEvents(sock) {
    sock.bind('call.assign', data => {
        if(store.getState().user == null) return;
        let unit = data.unit;
        let clone = cloneState();
        let call = clone.calls.find((e) => e.id === data.call.id);
        call.units.push(unit);
        let sunit = clone.police.find((e) => e.id === data.unit.id);
        if(isCurrentUser(unit.id)) {
            clone.active_call = call;
            attachSound.play();
        }
        if(sunit != null) {
            if(sunit.activecall != null) handleDetach(sunit);
            sunit.activecall = call;
        }
        store.dispatch({type: SET_STATE, state: clone});
    });

    sock.bind('unit.detach', data => {
        handleDetach(data.unit)
    });

    sock.bind('call.update', data => {
        if(store.getState().user == null) return;
        let clone = cloneState();
        let call = clone.calls.find((e) => e.id === data.call.id);
        if(call == null) clone.calls.push(data.call);
        else Object.assign(call, data.call);
        if(clone.active_call != null && clone.active_call.id == data.call.id) {
            Object.assign(clone.active_call, data.call);
        }
        console.log("Call Updated", call);
        store.dispatch({type: SET_STATE, state: clone});
    });

    sock.bind('call.archive', data => {
        if(store.getState().user == null) return;
        let clone = cloneState();
        let call = clone.calls.find((e) => e.id === data.call.id);
        var index = clone.calls.indexOf(call);
        if (index !== -1) clone.calls.splice(index, 1);
        store.dispatch({type: SET_STATE, state: clone});
    });

    sock.bind('call.log', data => {
        if(store.getState().user == null) return;
        let clone = cloneState();
        let call = clone.calls.find((e) => e.id == data.log.call_id);
        if(call == null) return;
        call.log.push(data.log);
        if(clone.active_call != null && clone.active_call.id == data.log.call_id && call !== clone.active_call) {
            if(clone.active_call.log.find((e) => e.id == data.log.id) == null)
                clone.active_call.log.push(data.log);
        }
        store.dispatch({type: SET_STATE, state: clone});
    });
}