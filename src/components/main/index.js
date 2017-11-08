import React from 'react';
import { connect } from 'react-redux'
import actions from '../../actions'
import { fetchPokeData, fetchPokeDex, saveLocalStorage } from '../../lib/pokeData'

import PokeStats from '../pokeStats'
import PokeList from '../pokeList'

const mapStateToProps = (state) => ({
  listViewStart: state.listViewStart,
  listViewEnd: state.listViewEnd,
  pokeDex: state.pokeDex,
  pokeData: state.pokeData,
  maxIndex: state.maxIndex,
})

const mapDispatchToProps = ({
  setPokeData: actions.setPokeData,
  setPokeDex: actions.setPokeDex,
  setPokeDexState: actions.setPokeDexState,
  setPokeDexPrevState: actions.setPokeDexPrevState,
  setPokeDexNextState: actions.setPokeDexNextState,
})

class Main extends React.Component {
  updatePokeData() {
    fetchPokeData().then(data => {
      this.props.setPokeData(data)
    })
    fetchPokeDex().then(data => {
      this.props.setPokeDex(data)
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.pokeDex !== nextProps.pokeDex) {
      saveLocalStorage(nextProps.pokeData, nextProps.pokeDex)
    }
  }
  componentDidMount() {
    this.updatePokeData()
  }
  render() {
    if (!this.props.pokeData) return null

    this.filteredSpecies = this.props.pokeData.species.filter(item => item.alolaId)
    this.filteredSpecies.sort((a, b) => a.alolaId - b.alolaId)

    return (
        <div className="container Main">
          <div className="jumbotron mb-0">
            <h3>Pok&eacute;Dex Tracker</h3>
            <small>Boris Wong, 2017</small>
            <p>
              Store the unseen / seen / caught status of your Pok&eacute;Dex of Sun / Moon for easy access.
            </p>
            <p>
              Usage:
              Press <kbd>Left</kbd> or <kbd>Right</kbd> to change state.
              Press <kbd>Up</kbd> or <kbd>Down</kbd> to traverse.
            </p>
            <p>
              Data is dynamically saved in your browsers local storage, so it is accessed in this device only (it is not synced without login).
            </p>
            <p>This project currently has no support for mobile keyboards/input.</p>
          </div>
          <PokeStats filteredSpecies={this.filteredSpecies} pokeDex={this.props.pokeDex} />
          <PokeList filteredSpecies={this.filteredSpecies} />
          <div className="footer small">
            <p>Pok&eacute;mon data is copyright &copy; 1995-2017 Nintendo / Game Freak. Some data taken from <a href="https://github.com/veekun/pokedex">veekun/pokdex</a> under the MIT license.</p>
          </div>
        </div>
    )
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(Main)
