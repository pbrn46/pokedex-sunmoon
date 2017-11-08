import React from 'react'

function PokeStats(props) {
  if (!props.filteredSpecies) return null
  if (!props.pokeDex) return null

  var stats = {seen: 0, caught: 0}
  for (let i = 0; i < props.filteredSpecies.length; i++) {
    var species = props.filteredSpecies[i]
    var dex = props.pokeDex[species.id]
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
  stats.total = props.filteredSpecies.length
  stats.seenPercent = Math.round((stats.seen / stats.total) * 100)
  stats.caughtPercent = Math.round((stats.caught / stats.total) * 100)
  stats.uncaught = stats.total - stats.caught
  stats.uncaughtPercent = Math.round((stats.uncaught / stats.total) * 100)

  return (
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
  )
}

export default PokeStats
