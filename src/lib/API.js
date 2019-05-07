import {DEV_API, PROD_API} from "../constants";

export const API_ENDPOINT = process.env.NODE_ENV !== "production" ? DEV_API : PROD_API;

export function dispatch(url, options) {
    if(options.headers == null)
        options.headers = {
            Authorization: localStorage.token
        };
    else
        options.headers.Authorization = localStorage.token;
    return new Promise((res, rej) => {
        fetch(API_ENDPOINT + url, options).then((d) => {if(d.status !== 204) return d.json();}).then((data) => res(data));
    });
}

export function login(email, password) {
    return new Promise((res, rej) => {
        dispatch('/auth/new', {
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(data => {
            res(data);
        });
    });
}

export function profile() {
    return new Promise((res, rej) => {
        dispatch('/profile', {}).then(data => {res(data)});
    });
}

export function state() {
    return new Promise((res, rej) => {
        dispatch('/game/p/state', {}).then(data => {res(data)});
    });
}

export function setCallsign(id) {
    return new Promise((res, rej) => {
        dispatch('/game/p/callsign', {method: 'PATCH',
            body: JSON.stringify({
                callsign: id
            }),
            headers: {
                'Content-Type': 'application/json'
            }}).then(data => {res(data)});
    });
}

export function changeStatus(newS) {
    return new Promise((res, rej) => {
        dispatch('/game/p/status', {method: 'PATCH',
            body: JSON.stringify({
                status: newS
            }),
            headers: {
                'Content-Type': 'application/json'
            }}).then(data => {res(data)});
    });
}

export function detachFromCall() {
    return new Promise((res, rej) => {
        dispatch('/game/p/detach', {method: 'POST'}).then(data => {res(data)});
    });
}

export function setUnitStatus(unitId, newStatus) {
    if(newStatus === "Off-Duty") newStatus = null;
    return new Promise((res, rej) => {
        dispatch('/game/d/status/' + unitId, {method: 'PATCH',
            body: JSON.stringify({
                status: newStatus
            }),
            headers: {
                'Content-Type': 'application/json'
            }}).then(data => {res(data)});
    });
}