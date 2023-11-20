import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/global.css'
import Router from './components/router/Router';
import Store from './store/store';

const store = new Store();

export const Context = createContext({
  store,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    store
  }}>
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </Context.Provider>

);
