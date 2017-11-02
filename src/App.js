import React, { Component } from 'react';

import { Provider } from 'react-redux'


import Store from './store'

import PokeList from './components/pokeList'

import './App.css';


class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <div className="container App">
          <div>
            Usage:
            Press <kbd>Left</kbd> or <kbd>Right</kbd> to change state.
            Press <kbd>Up</kbd> or <kbd>Down</kbd> to traverse.
          </div>
          <PokeList />
        </div>
      </Provider>
    )
  }
}

export default App;
