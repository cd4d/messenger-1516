import { createStore, applyMiddleware, combineReducers ,compose} from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";

// redux browser extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT,
  };
};

const appReducer = combineReducers({
  user,
  conversations,
  activeConversation,
});
const rootReducer = (state, action) => {
  if (action.type === CLEAR_ON_LOGOUT) {
    // set state to initial state
    state = undefined;
  }
  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  composeEnhancers(
  applyMiddleware(thunkMiddleware, loggerMiddleware))
);
