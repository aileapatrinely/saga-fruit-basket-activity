import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, takeLatest, put } from 'redux-saga/effects';
import Axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
  yield takeEvery('GET_BASKET', basketSaga);
  yield takeEvery('POST_FRUIT', postSaga);
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// This function (our reducer) will be called when an
// action is dipatched. state = ['Apple'] sets the default
// value of the array.
const basketReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_BASKET':
      return action.payload;
    default:
      return state;
  }
};

function* basketSaga(action) {
  try {
    const response = yield Axios.get('/fruit');
    yield put({
      type: 'SET_BASKET',
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
  }
}

function* postSaga(action) {
  try {
    yield Axios.post('/fruit', action.payload);
    yield put({
      type: 'GET_BASKET',
    });
  } catch (err) {
    console.log(err);
  }
}

// Create one store that all components can use
const storeInstance = createStore(
  combineReducers({
    basketReducer,
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={storeInstance}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
