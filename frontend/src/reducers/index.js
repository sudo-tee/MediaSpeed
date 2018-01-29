import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";

export default combineReducers({
    libraries,
    mainMenu
});