import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { PokeDataHandler, fetchPokeData, fetchPokeDex, saveLocalStorage } from '../../lib/pokeData'

import './index.css'

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


class PokeList extends React.Component {
  constructor(props) {
    super(props)
    this.listInputs = {}
  }
  selectNextInput(id) {
    var next = this.filteredSpecies.findIndex(item => parseInt(item.id, 10) === id) + 1
    next = this.filteredSpecies[next] ? this.filteredSpecies[next].id : this.filteredSpecies[0].id
    var nextInput = this.listInputs[next]
    if (nextInput) {
      nextInput.focus()
      nextInput.selectionStart = nextInput.selectionEnd = nextInput.value.length
    }
  }
  selectPrevInput(id) {
    var prev = this.filteredSpecies.findIndex(item => parseInt(item.id, 10) === id) - 1
    prev = this.filteredSpecies[prev] ? this.filteredSpecies[prev].id : this.filteredSpecies[this.filteredSpecies.length - 1].id
    var prevInput = this.listInputs[prev]
    if (prevInput) {
      prevInput.focus()
      prevInput.selectionStart = prevInput.selectionEnd = prevInput.value.length
    }
  }
  handleInputKeyDown(e, id) {
    var preventDefault = true
    switch (e.key) {
      case "ArrowDown":
        this.selectNextInput(id)
        break
      case "ArrowUp":
        this.selectPrevInput(id)
        break
      case "ArrowLeft":
        this.props.setPokeDexPrevState(id)
        break
      case "ArrowRight":
        this.props.setPokeDexNextState(id)
        break
      default:
        preventDefault = false
        break
    }
    if (preventDefault) {
      e.preventDefault()
    }
    return false
  }
  parseDex(dexObj) {
    if (!dexObj) {
      dexObj = {state: 0}
    }
    return dexObj
  }
  getBgColor(state) {
    switch (state) {
      case 0:
        return "#fab"
      case 1:
        return "#fea"
      case 2:
        return "#dfd"
      default:
        return "#879"
    }
  }
  renderListItem(id) {
    var dexObj = this.parseDex(this.props.pokeDex[id])
    var species = this.props.pokeData.species.find(item => (parseInt(item.id, 10) === id))
    var speciesName = PokeDataHandler.getSpeciesNameById(this.props.pokeData, id)
    var alolaId = species && parseInt(species.alolaId, 10)
    // var alolaId3 = String(alolaId).padStart(3, "0")
    var id3 = String(id).padStart(3, "0")
    var stateName = PokeDataHandler.dexStateToName(dexObj.state)
    var bgColor = this.getBgColor(dexObj.state)
    return (
      <div className="row PokeList-item" key={id}>
        <div className="col-4">
          [<a href={`https://pokemondb.net/pokedex/${id3}#dex-evolution`} target="_blank">
          pdb.net
          </a>]
      [<a href={`https://www.serebii.net/pokedex-sm/${id3}.shtml`} target="_blank">
        srb.net
      </a>]{' '}
      [<a href={`https://bulbapedia.bulbagarden.net/wiki/${speciesName}_(Pokémon)#Evolution`} target="_blank">
        bul.net
      </a>]
        </div>
        <div className="col-1">{id}</div>
        <div className="col-1">{alolaId}</div>
        <div className="col-2">
          <input type="text"
            className="w-100 text-center"
            ref={el => this.listInputs[id] = el}
            onChange={() => {return false}}
            style={{backgroundColor: bgColor}}
            onKeyDown={(e) => {this.handleInputKeyDown(e, id)}}
            value={stateName} />
        </div>
        <div className="col">
          <b>{speciesName}</b>{' '}
        </div>
      </div>
    )
  }
  renderList() {
    var items = []
    for (let i = 0; i < this.filteredSpecies.length; i++) {
      items.push(this.renderListItem(parseInt(this.filteredSpecies[i].id, 10)))
    }
    return items
  }
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

    var stats = {seen: 0, caught: 0}
    for (let i = 0; i < this.filteredSpecies.length; i++) {
      var species = this.filteredSpecies[i]
      var dex = this.props.pokeDex[species.id]
      if (dex) {
        switch (dex.state) {
          case 1:
            stats.seen += 1
            break
          case 2:
            stats.caught += 1
            break
          default:
            break
        }
      }
    }
    stats.total = this.filteredSpecies.length
    stats.seenPercent = Math.round((stats.seen / stats.total) * 100)
    stats.caughtPercent = Math.round((stats.caught / stats.total) * 100)
    stats.uncaught = stats.total - stats.caught
    stats.uncaughtPercent = Math.round((stats.uncaught / stats.total) * 100)
    return (
      <div className="PokeList">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-text">
            Seen
            {' '}
            {stats.seen}
            {' '}
            <span className="badge badge-pill badge-secondary">
              {stats.seenPercent}%
            </span>
          </span>
          <span className="navbar-text">
            Caught
            {' '}
            {stats.caught}
            {' '}
            <span className="badge badge-pill badge-secondary">
              {stats.caughtPercent}%
            </span>
          </span>
          <span className="navbar-text">
            Uncaught
            {' '}
            {stats.uncaught}
            {' '}
            <span className="badge badge-pill badge-secondary">
              {stats.uncaughtPercent}%
            </span>
          </span>
          <span className="navbar-text">
            Total
            {' '}
            {stats.total}
          </span>
        </nav>
        <div>
          {this.renderList()}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(PokeList)
