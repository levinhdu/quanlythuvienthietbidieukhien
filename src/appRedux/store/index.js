import createSagaMiddleware from "redux-saga";
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import rootSaga from "../sagas/index";
import createRootReducer from '../reducers'

const createBrowserHistory = require('history').createBrowserHistory;

export const history = createBrowserHistory();

const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routeMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        ...middlewares
      ),
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
