import { combineReducers } from 'redux'

import { windows, windowPlacements } from './windows'
import { reducer as microverse } from '@microverse-network/redux'
import { reducer as network } from './network'
import { reducer as compute } from './compute'
import { reducer as distribute } from './distribute'
import { query } from './query'
import { logs } from './logs'
import { mch } from './mch'
import { drawing } from './drawing'

export default combineReducers({
  windows,
  windowPlacements,
  network,
  microverse,
  compute,
  distribute,
  query,
  logs,
  mch,
  drawing,
})
