import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './components/App.jsx'
import reducers from './reducers/store.js';
import promise from 'redux-promise';
import styles from './styles.css';
import mdb from './mdb.css';
import bootstrap from './bootstrap.css';
import b from '../js/bootstrap.min.js'
import jq from '../js/jquery-3.1.1.min.js'

// import { loadState, saveState } from './localStorage'
import { persistStore, autoRehydrate } from 'redux-persist'
import thunk from 'redux-thunk'

// const persistedState = loadState()
const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(promise, thunk), autoRehydrate())(createStore);

const store = createStoreWithMiddleware(reducers)

// const store = createStore(
//   reducers,
//   undefined,
//   compose(
//     applyMiddleware(promise),
//     autoRehydrate
//   )
// )

persistStore(store)

render((
  <Provider store={store}>
    <BrowserRouter>
      <App store={store}/>
    </BrowserRouter>
  </Provider>
), document.getElementById('app'))
