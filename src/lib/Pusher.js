import Pusher from 'pusher-js';
import {store} from "../index";
import {SET_STATE} from "../reducers";
import attachS from '../sound/attach.mp3';
import {PUSHER_APP_CLUSTER, PUSHER_APP_KEY} from "../constants";
import {RegisterEvents} from "./Pusher/CallManager";
import {API_ENDPOINT} from "./API";

Pusher.logToConsole = process.env.NODE_ENV !== "production";

var sock;
var police;
var civilian;
var policecalls;
var personal;
var attachedCall;

export function initPusher() {
    sock = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: API_ENDPOINT + "/tp/pusher/authorize",
        auth: {
            headers: {
                Authorization: localStorage.token
            }
        }
    });
    police = sock.subscribe('police');
    civilian = sock.subscribe('civilian');
    store.subscribe(() => {
        let state = store.getState();
        if(state.user != null && personal === undefined) {
            subscribeToPersonal(state.user.id);
        } else if(state.user == null && personal !== undefined) {
            personalUbsub();
            personal = undefined;
        }
        if(state.active_call != null && attachedCall == null) {
            attachedCall = sock.subscribe('police.calls.' + state.active_call.id);
        } else if(state.active_call == null && attachedCall != null) {
            attachedCall.unsubscribe();
            attachedCall = undefined;
        }
    });
}

function subscribeToPersonal(id) {
    sock.config.auth.headers.Authorization = localStorage.token;
    policecalls = sock.subscribe('private-police.calls');
    personal = sock.subscribe('private-user.' + id);
    RegisterEvents(policecalls);
}

function personalUbsub() {
    policecalls.unsubscribe();
    personal.unsubscribe();
}

export function cloneState() {
    let clone = {};
    Object.assign(clone, store.getState().state);
    return clone;
}

export function isCurrentUser(id) {
    return id === store.getState().user.id;
}
