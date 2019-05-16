import {store} from "../../index";
import {SET_USER} from "../../reducers";

function cloneUser() {
    let a = {};
    Object.assign(a, store.getState().user);
    return a;
}

function compileVehicles(characters) {
    let vehs = [];
    characters.forEach((e) => {
        let b = {};
        Object.assign(b, e);
        delete b.vehicles;
        e.vehicles.forEach(ee => {
            let a = {};
            Object.assign(a, ee);
            a.character = b;
            vehs.push(a);
        });
    });
    return vehs;
}

export function subscribe(sock) {
    sock.bind('character.new', (data) => {
        let state = cloneUser();
        state.characters.push(data.character);
        store.dispatch({type: SET_USER, user: state});
    });
    sock.bind('character.del', (data) => {
        let state = cloneUser();
        let char = state.characters.find((e) => e.id == data.character.id);
        let index = state.characters.indexOf(char);
        state.characters.splice(index, 1);
        store.dispatch({type: SET_USER, user: state});
    });
    sock.bind('character.update', (data) => {
        let state = cloneUser();
        let char = state.characters.find((e) => e.id == data.character.id);
        Object.assign(char, data.character);
        store.dispatch({type: SET_USER, user: state});
    });
    sock.bind('vehicle.new', (data) => {
        let state = cloneUser();
        let char = state.characters.find((e) => e.id == data.vehicle.character.id);
        char.vehicles.push(data.vehicle);
        store.dispatch({type: SET_USER, user: state});
    });
    sock.bind('vehicle.update', (data) => {
        let state = cloneUser();
        let c = state.characters.find((e) => e.id == data.vehicle.character.id);
        let veh = c.vehicles.find((e) => e.id == data.vehicle.id);
        Object.assign(veh, data.vehicle);
        store.dispatch({type: SET_USER, user: state});
    });
    sock.bind('vehicle.delete', (data) => {
        let state = cloneUser();
        let c = state.characters.find((e) => e.id == data.vehicle.character.id);
        let veh = c.vehicles.find((e) => e.id == data.vehicle.id);
        let index = c.vehicles.indexOf(veh);
        c.vehicles.splice(index, 1);
        store.dispatch({type: SET_USER, user: state});
    });
}