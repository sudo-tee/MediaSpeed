import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";

export default combineReducers({
    libraries,
    movies,
    shows,
    mainMenu
});



