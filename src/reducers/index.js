import { combineReducers } from 'redux'
import lightstatus from './lightstatus'
import colors from './colors'
import camera from './camera'
import draw from './draw'

const reduced = combineReducers({
  lightstatus,
  colors,
  camera,
  draw
})

export default reduced
