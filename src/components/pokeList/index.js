import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions'
import { PokeDataHandler } from '../../lib/pokeData'

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
    var next = this.props.filteredSpecies.findIndex(item => parseInt(item.id, 10) === id) + 1
    next = this.props.filteredSpecies[next] ? this.props.filteredSpecies[next].id : this.props.filteredSpecies[0].id
    var nextInput = this.listInputs[next]
    if (nextInput) {
      nextInput.focus()
      nextInput.selectionStart = nextInput.selectionEnd = nextInput.value.length
    }
  }
  selectPrevInput(id) {
    var prev = this.props.filteredSpecies.findIndex(item => parseInt(item.id, 10) === id) - 1
    prev = this.props.filteredSpecies[prev] ? this.props.filteredSpecies[prev].id : this.props.filteredSpecies[this.props.filteredSpecies.length - 1].id
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
    for (let i = 0; i < this.props.filteredSpecies.length; i++) {
      items.push(this.renderListItem(parseInt(this.props.filteredSpecies[i].id, 10)))
    }
    return items
  }
  render() {
    return (
      <div className="PokeList">
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
