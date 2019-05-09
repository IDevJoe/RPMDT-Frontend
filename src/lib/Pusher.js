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
var attachedCall;

export function initPusher() {
    store.subscribe(() => {
        let state = store.getState();
        if(state.user != null && personal === undefined) {
            subscribeToPersonal(state.user.id);
        } else if(state.user == null && personal !== undefined) {
            personalUbsub();
            personal = undefined;
        }
        if(state.active_call != null && attachedCall === undefined) {
            attachedCall = sock.subscribe('police.calls.' + state.active_call.id);
        } else if(state.active_call == null && attachedCall !== undefined) {
            attachedCall.unsubscribe();
            attachedCall = undefined;
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

policecalls.bind('call.assign', data => {
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

policecalls.bind('unit.detach', data => {
    handleDetach(data.unit)
});

policecalls.bind('call.update', data => {
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

policecalls.bind('call.archive', data => {
    if(store.getState().user == null) return;
    let clone = cloneState();
    let call = clone.calls.find((e) => e.id === data.call.id);
    var index = clone.calls.indexOf(call);
    if (index !== -1) clone.calls.splice(index, 1);
    store.dispatch({type: SET_STATE, state: clone});
});

policecalls.bind('call.log', data => {
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