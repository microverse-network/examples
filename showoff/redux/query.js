import { aStar } from 'ngraph.path'

export const MAKE_QUERY = '@query/MAKE'
export const RESET_QUERY = '@query/RESET'

const initialState = {
  active: false,
  from: '',
  to: '',
  dataset: '',
  response: {},
}

const responses = {
  wikipedia: {
    title: 'Richard Feynman',
    snippet: `Richard Phillips Feynman (/ˈfaɪnmən/; May 11, 1918 – February 15, 1988) was an American theoretical physicist, known for his work in the path integral`,
    timestamp: '2018-06-27T08:18:44Z',
    pageid: 25523,
    size: 103654,
    wordcount: 12381,
    ns: 0,
  },
  kaggle: {
    timestamp: 1513514220,
    open: 19891.99,
    high: 19891.99,
    low: 19891.98,
    close: 19891.98,
    volume_BTC: 3.32321042,
    volume_currency: 66105.25087,
    weighted_price: 19891.984712,
  },
}

export const query = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case MAKE_QUERY: {
      const { from, to, dataset } = payload
      const response = responses[dataset]
      state = { active: true, from, to, dataset, response }
      break
    }

    case RESET_QUERY: {
      state = {
        active: false,
        from: '',
        to: '',
        dataset: '',
        response: '',
      }
      break
    }
  }

  return state
}

export const makeQuery = payload => ({
  type: MAKE_QUERY,
  payload,
})

export const resetQuery = payload => ({
  type: RESET_QUERY,
  payload,
})

export const queryPath = ({ query, network, microverse: { nodes } }) => {
  if (!query.active) {
    return {}
  }

  const node = nodes[query.from]
  const cluster = network[node.clusterId]

  if (!cluster) {
    return {}
  }

  const pathFinder = aStar(cluster.graph)

  try {
    const path = pathFinder.find(query.from, query.to)
    return { [node.clusterId]: path }
  } catch (e) {
    return {}
  }
}
