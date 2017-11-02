import csv from 'fast-csv'
// import Promise from 'bluebird'
import pokeSpeciesNamesCsv from '../assets/pokemon_species_names.csv'
import pokeSpeciesCsv from '../assets/pokemon_species.csv'
import pokeDexNumbersCsv from '../assets/pokemon_dex_numbers.csv'
import pokeDexSunMoonCsv from '../assets/pokedex_sunmoon.csv'


const local_language_id = "9"

function csvToObj(filename) {
  return new Promise((resolve, reject) => {
    fetch(filename).then(res => {
      res.text().then(data => {
        var records = []
        csv.fromString(data, {headers: true}).on('data', data => {
          records.push(data)
        }).on('end', () => {
          resolve(records)
        })
      })
    })
  })
}

function filterPokeObj(pokeObj, filterKey, filterValue) {
  return pokeObj.filter(item => (item[filterKey] === filterValue))
}


export class PokeDataHandler {
  static getSpeciesNameById(pokeData, id) {
    if (!pokeData) return null
    let species = pokeData.speciesNames.find(item => (
      parseInt(item.pokemon_species_id, 10) === id && item.local_language_id === local_language_id
    ))
    return species && species.name
  }
  static dexStateToName(state) {
    switch (state) {
      case 0:
        return "unseen"
      case 1:
        return "seen"
      case 2:
        return "caught"
      default:
        return "error"
    }
  }
}

function mergeSunMoonDexToSpecies(species, keyName, dexSunMoon) {
  for (let i = 0; i < species.length; i++) {
    let found = dexSunMoon.find(item =>
      (parseInt(item.National, 10) === parseInt(species[i].id, 10)))
    if (found) {
      species[i][keyName] = found.Alola
    }
  }
  return species
}

// const pokeDataCacheTime_Timeout = 1000 * 60 * 60

function clearLocalStorage() {
  window.localStorage.removeItem("pokeData")
  window.localStorage.removeItem("pokeDex")
  window.localStorage.removeItem("pokeDataCacheTime")
}

function fetchLocalStoragePokeDex() {
  var pokeDataCacheTime = JSON.parse(window.localStorage.getItem("pokeDataCacheTime"))
  // var pokeDataCacheTime = 0
  if (!pokeDataCacheTime) {
    clearLocalStorage()
    return {}
  }
  return JSON.parse(window.localStorage.getItem("pokeDex"))
}

function fetchLocalStoragePokeData() {
  var pokeDataCacheTime = JSON.parse(window.localStorage.getItem("pokeDataCacheTime"))
  // var pokeDataCacheTime = 0
  if (!pokeDataCacheTime) {
    clearLocalStorage()
    return null
  }
  return JSON.parse(window.localStorage.getItem("pokeData"))
}

export function saveLocalStorage(pokeData, pokeDex) {
  console.log("localStorage: Saving.")
  window.localStorage.setItem("pokeData", JSON.stringify(pokeData))
  window.localStorage.setItem("pokeDex", JSON.stringify(pokeDex))
  window.localStorage.setItem("pokeDataCacheTime", JSON.stringify(Date.now()))
}

async function fetchFromCsv() {
  var pokeData = {}
  pokeData.dexSunMoon = await csvToObj(pokeDexSunMoonCsv)
  pokeData.species = await csvToObj(pokeSpeciesCsv)
  pokeData.species = mergeSunMoonDexToSpecies(pokeData.species, "alolaId", pokeData.dexSunMoon)
  pokeData.speciesNames = await csvToObj(pokeSpeciesNamesCsv)
  pokeData.speciesNames = filterPokeObj(pokeData.speciesNames, "local_language_id", "9")
  pokeData.dexNumbers = await csvToObj(pokeDexNumbersCsv)
  pokeData.dexState = {}
  return(pokeData)
}
// clearLocalStorage()

// var cachedPokeData = fetchLocalStorage()
export async function fetchPokeData() {
  var cachedPokeData = fetchLocalStoragePokeData()
  if (cachedPokeData) {
    console.log("pokeData: Using local storage.")
    return(cachedPokeData)
  }
  else {
    console.log("Fetching from csv.")
    var pokeData = await fetchFromCsv()
    saveLocalStorage(pokeData, {})
    // await pokeData
    return pokeData
  }
}

export async function fetchPokeDex() {
  var cachedPokeDex = fetchLocalStoragePokeDex()
  if (cachedPokeDex) {
    console.log("pokeDex: Using local storage.")
    return(cachedPokeDex)
  }
  else {
    return {}
  }
}

export default fetchPokeData
