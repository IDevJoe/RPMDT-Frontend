import {store} from "../../index";
import {SET_USER} from "../../reducers";

function cloneUser() {
    let a = {};
    Object.assign(a, store.getState().user);
    return a;
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
    })
}