import { getRandomCity } from '../utils/cities'
import { getBrowser } from '@microverse-network/redux/src/utils'

export const LOG = '@logs/LOG'
export const RESET_LOGS = '@logs/RESET'
const LOG_COUNT = 10
const initialState = {
  calls: [],
  counts: {},
}

export const logs = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case LOG: {
      const { type, log } = payload
      log.gas = Math.random()
      log.location = getRandomCity()
      log.type = log.type || (Math.random() > 0.2 ? 'call' : 'query')
      log.platform = log.platform || getBrowser()
      const count = state.counts[type] || 0
      state = {
        ...state,
        [type]: [...state[type].slice(-LOG_COUNT + 1), log],
        counts: { [type]: count + 1 },
      }
      break
    }

    case RESET_LOGS: {
      const { type } = payload
      state = { ...state, [type]: [] }
      break
    }
  }

  return state
}

export const logCall = payload => ({
  type: LOG,
  payload,
})

export const resetLogs = payload => ({
  type: RESET_LOGS,
  payload,
})
