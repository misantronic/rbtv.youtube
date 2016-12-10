// Redux methods
import { createStore, applyMiddleware } from 'redux';

// Middlewares
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const middleware = applyMiddleware(promise(), thunk, createLogger({ collapsed: true }));

import reducer from './reducers';

export default createStore(reducer, middleware);
