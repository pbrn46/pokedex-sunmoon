import React from 'react';
import { Provider } from 'react-redux'

import Store from './store'

import './App.css';

import Main from './components/main'


class App extends React.Component {
  render() {

    return (
      <Provider store={Store}>
        <Main />
      </Provider>
    )
  }
}

export default App
