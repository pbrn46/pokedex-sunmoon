import * as actions  from '.'
export default actions

export const SET_POKEDATA = "SET_POKEDATA"
export const setPokeData = (pokeData) => ({
  type: SET_POKEDATA,
  pokeData,
})

export const SET_POKEDEX = "SET_POKEDEX"
export const setPokeDex = (pokeDex) => ({
  type: SET_POKEDEX,
  pokeDex,
})

export const SET_POKEDEX_STATE = "SET_POKEDEX_STATE"
export const setPokeDexState = (id, state) => ({
  type: SET_POKEDEX_STATE,
  id,
  state,
})

export const SET_POKEDEX_PREVSTATE = "SET_POKEDEX_PREVSTATE"
export const setPokeDexPrevState = (id) => ({
  type: SET_POKEDEX_PREVSTATE,
  id,
})

export const SET_POKEDEX_NEXTSTATE = "SET_POKEDEX_NEXTSTATE"
export const setPokeDexNextState = (id) => ({
  type: SET_POKEDEX_NEXTSTATE,
  id,
})
