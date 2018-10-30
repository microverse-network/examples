import { aStar } from 'ngraph.path'
import { combineReducers } from 'redux'

import currentTime from 'microverse-web-worker!../currentTime'
import random from 'microverse-web-worker!lodash/random'

export const SET_ACTIVE_COMPUTE = '@compute/SET_ACTIVE_COMPUTE'
export const RESET_COMPUTE = '@compute/RESET_COMPUTE'

const initialServices = [
  {
    name: 'lodash/random',
    fn: random,
    args: [0, 500],
    code: '',
  },
  {
    name: 'currentTime',
    fn: currentTime,
    args: [],
    renderResult: res => {
      return JSON.stringify(res, null, 2)
    },
    code: '',
  },
]

const services = (state = initialServices, { type, payload } = {}) => {
  return state
}

export const activeCompute = (state = null, { type, payload } = {}) => {
  switch (type) {
    case SET_ACTIVE_COMPUTE: {
      state = payload
      break
    }
    case RESET_COMPUTE: {
      state = null
      break
    }
    case 'CLOSE_WINDOW': {
      const { id } = payload
      if (id !== 'TryWindow') break
      state = null
      break
    }
    case 'CLOSE_ALL_WINDOWS': {
      state = null
      break
    }
  }

  return state
}

export const reducer = combineReducers({ services, active: activeCompute })

export const resetCompute = payload => ({
  type: RESET_COMPUTE,
})

export const setActiveCompute = payload => ({
  type: SET_ACTIVE_COMPUTE,
  payload,
})

export const computePath = ({ compute, network, microverse: { nodes } }) => {
  if (!compute.active) {
    return {}
  }

  const node = nodes[compute.active.from]
  const cluster = network[node.clusterId]

  if (!cluster) {
    return {}
  }

  const pathFinder = aStar(cluster.graph)

  try {
    const path = pathFinder.find(compute.active.from, compute.active.to)
    return { [node.clusterId]: path }
  } catch (e) {
    return {}
  }
}
