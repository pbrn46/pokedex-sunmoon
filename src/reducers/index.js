import { combineReducers } from 'redux'
import actions from '../actions'


function pokeData(state=null, action) {
  switch (action.type) {
    case actions.SET_POKEDATA:
      return action.pokeData
    default:
      return state
  }
}

function pokeDex(state={}, action) {
  // Index is pokemon id
  // {state: 2-"caught"|1-"seen"|0-"unseen"}
  switch (action.type) {
    case actions.SET_POKEDEX:
      return action.pokeDex
    case actions.SET_POKEDEX_STATE: {
      let newObj = state[action.id] || {state: 0}
      newObj.state = action.state
      state[action.id] = newObj
      return {...state}
    }
    case actions.SET_POKEDEX_PREVSTATE: {
      let newObj = state[action.id] || {state: 0}
      newObj.state = newObj.state - 1
      if (newObj.state < 0) {
        newObj.state = 2
      }
      state[action.id] = newObj
      return {...state}
    }
    case actions.SET_POKEDEX_NEXTSTATE: {
      let newObj = state[action.id] || {state: 0}
      newObj.state = newObj.state + 1
      if (newObj.state > 2) {
        newObj.state = 0
      }
      state[action.id] = newObj
      return {...state}
    }
    default:
      return state
  }
}

function listViewStart(state=1, action) {
  return state
}

function listViewEnd(state=949, action) {
  return state
}

function maxIndex(state=949, action) {
  return state
}

export default combineReducers({
  pokeData,
  listViewStart,
  listViewEnd,
  pokeDex,
  maxIndex,
})
