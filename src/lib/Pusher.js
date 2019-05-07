import Pusher from 'pusher-js';
import {store} from "../index";
import {SET_STATE} from "../reducers";
import attachS from '../sound/attach.mp3';
import {PUSHER_APP_CLUSTER, PUSHER_APP_KEY} from "../constants";

Pusher.logToConsole = process.env.NODE_ENV !== "production";

const sock = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_APP_CLUSTER,
    forceTLS: true
});

var police = sock.subscribe('police');
var civilian = sock.subscribe('civilian');
var policecalls = sock.subscribe('police.calls');
var personal;

export function initPusher() {
    store.subscribe(() => {
        let state = store.getState();
        if(state.user != null && personal === undefined) {
            subscribeToPersonal(state.user.id);
        } else if(state.user == null && personal !== undefined) {
            personalUbsub();
            personal = undefined;
        }
    });
}

function subscribeToPersonal(id) {
    personal = sock.subscribe('user.' + id)
}

function personalUbsub() {
    personal.unsubscribe();
}

function cloneState() {
    let clone = {};
    Object.assign(clone, store.getState().state);
    return clone;
}

function isCurrentUser(id) {
    return id === store.getState().user.id;
}

police.bind('user.callsignchange', data => {
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

police.bind('user.statuschange', data => {
    if(store.getState().user == null) return;
    let clone = cloneState();
    if(isCurrentUser(data.user.id)) {
        clone.status = data.newStatus;
    } else {
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
    }
    store.dispatch({type: SET_STATE, state: clone});
});

let attachSound = new Audio(attachS);

policecalls.bind('call.assign', data => {
    if(store.getState().user == null) return;
    let unit = data.unit;
    let clone = cloneState();
    let call = clone.calls.find((e) => e.id === data.call.id);
    call.units.push(unit);
    let sunit = clone.police.find((e) => e.id === data.unit.id);
    sunit.activecall = call;
    if(isCurrentUser(unit.id)) {
        clone.active_call = call;
        attachSound.play();
    }
    store.dispatch({type: SET_STATE, state: clone});
});

policecalls.bind('unit.detach', data => {
    if(store.getState().user == null) return;
    let unit = data.unit;
    let clone = cloneState();
    let sunit = clone.police.find((e) => e.id === data.unit.id);
    let call = clone.calls.find((e) => e.id === sunit.activecall.id);
    if(call != null) {
        let unit2 = call.units.find((e) => e.id === sunit.id);
        var index = call.units.indexOf(unit2);
        if (index !== -1) call.units.splice(index, 1);
    }
    sunit.activecall = null;
    if(isCurrentUser(unit.id)) clone.active_call = null;
    store.dispatch({type: SET_STATE, state: clone});
});