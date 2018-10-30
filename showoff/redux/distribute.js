import { combineReducers } from 'redux'
import { find, uniqBy } from 'lodash'
import randomColor from 'randomcolor'

export const SET_DISTRIBUTIONS = '@distribute/SET_DISTRIBUTIONS'
export const ADD_DISTRIBUTION = '@distribute/ADD_DISTRIBUTION'
export const REMOVE_DISTRIBUTION = '@distribute/REMOVE_DISTRIBUTION'
export const SET_ACTIVE_DATASET = '@distribute/SET_ACTIVE_DATASET'
export const RESET_DATASET = '@distribute/RESET_DATASET'

const color = seed => randomColor({ hue: 'pink', seed })

const initialDatasets = {
  wikipedia: {
    name: 'Wikipedia Database',
    query: `await peer.db
          .get('wikipedia')
          .find({ title: 'Richard Feynman' })`,
    storage: '50.12 GB',
    radius: 50,
    slug: 'wikipedia',
    color: color('wikipedia'),
    isUsed: false,
    nodes: [],
  },
  // https://www.kaggle.com/mczielinski/bitcoin-historical-data#coinbaseUSD_1-min_data_2014-12-01_to_2018-06-27.csv
  kaggle: {
    name: 'Bitcoin Historical Data (Kaggle)',
    query: `await peer.db
          .get('kaggle-bitcoin')
          .find({ timestamp: 1513514220 })`,
    storage: '148 MB',
    radius: 17,
    slug: 'kaggle',
    color: color('kaggle'),
    isUsed: false,
    nodes: [],
  },
}

export const datasets = (state = initialDatasets, { type, payload } = {}) => {
  switch (type) {
    case SET_DISTRIBUTIONS: {
      const nodes = payload.map(dataset => dataset.node)
      const { dataset } = payload[0]
      state = {
        ...state,
        [dataset]: {
          ...state[dataset],
          isUsed: !!nodes.length,
          nodes,
        },
      }
      break
    }

    case REMOVE_DISTRIBUTION: {
      const { node, dataset } = payload
      if (!state[dataset].nodes.includes(node)) return state
      const nodes = state[dataset].nodes.filter(n => n !== node)
      state = {
        ...state,
        [dataset]: {
          ...state[dataset],
          isUsed: !!nodes.length,
          nodes,
        },
      }
      break
    }

    case ADD_DISTRIBUTION: {
      const { node, dataset } = payload
      if (state[dataset].nodes.includes(node)) return state
      const nodes = [...state[dataset].nodes, node]
      state = {
        ...state,
        [dataset]: {
          ...state[dataset],
          isUsed: !!nodes.length,
          nodes,
        },
      }
      break
    }
  }

  return state
}

export const distributions = (state = [], { type, payload } = {}) => {
  switch (type) {
    case SET_DISTRIBUTIONS: {
      state = payload || []
      break
    }

    case REMOVE_DISTRIBUTION: {
      const { _id } = payload
      const nodes = state.filter(ds => ds._id !== _id)
      state = nodes
      break
    }

    case ADD_DISTRIBUTION: {
      const { _id } = payload
      if (state.find(ds => ds._id === _id)) return state
      const nodes = [...state, payload]
      state = nodes
      break
    }
  }
  return state
}

export const reducer = combineReducers({
  distributions,
  datasets,
})

export const setDistributions = payload => ({
  type: SET_DISTRIBUTIONS,
  payload,
})
export const addDistribution = payload => ({
  type: ADD_DISTRIBUTION,
  payload,
})
export const removeDistribution = payload => ({
  type: REMOVE_DISTRIBUTION,
  payload,
})

export const getDatasets = state => state.distribute.datasets

export const getDataset = state => slug => getDatasets(state)[slug]

export const getDistributions = state => slug =>
  state.distribute.distributions.filter(d => d.dataset === slug)

export const getDistributionNodes = state => slug => {
  if (!slug) return []

  const distributions = getDistributions(state)(slug)

  const nodes = uniqBy(
    distributions.map(d => {
      const node = state.microverse.nodes[d.node]
      const { layout } = state.network[node.clusterId]
      const { coordinates } = find(state.clusterGrid, {
        clusterId: node.clusterId,
      })

      return {
        id: node._id,
        ...pushPoint(layout.getNodePosition(node._id), coordinates[3]),
      }
    }),
    ({ id }) => id,
  )

  return nodes
}

const pushPoint = (position, [offsetX, offsetY]) => ({
  x: position.x + offsetX,
  y: position.y + offsetY,
})
