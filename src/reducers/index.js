import {combineReducers} from "redux";

export const SET_USER = "SET_USER";
export const SET_STATE = "SET_STATE";
export const SET_CHARACTERS = "SET_CHARACTERS";

function user(state = null, action) {
    switch(action.type) {
        case SET_USER:
            return action.user;
        default:
            return state;
    }
}

function state(state = null, action) {
    switch(action.type) {
        case SET_STATE:
            return action.state;
        default:
            return state;
    }
}

function characters(state = [], action) {
    switch(action.type) {
        case SET_CHARACTERS:
            return action.characters;
        default:
            return state;
    }
}

export default combineReducers({user, state});