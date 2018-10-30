export const UPDATE = '@mch/UPDATE'
const JUN1ST2018 = 1527836400000

const updateDistributedMCH = () => {
  const elapsedTimeInSeconds = (Date.now() - JUN1ST2018) / 1000
  const distributedPerSecond = 0.0001
  const distributedMCH = elapsedTimeInSeconds * distributedPerSecond
  return distributedMCH
}

const initialState = {
  distributed: updateDistributedMCH(),
}

export const mch = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case UPDATE: {
      const distributed = updateDistributedMCH()
      state = { ...state, distributed }
      break
    }
  }

  return state
}

export const updateMCH = payload => ({
  type: UPDATE,
  payload,
})
