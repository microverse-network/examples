import { createStore, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducers from './reducers'

const composeEnhancers = composeWithDevTools({
  // breaks redux devtools
  // actionsBlacklist: ['@network/NEXT_LAYOUT_STEP'],
})
const middleware = composeEnhancers(applyMiddleware(promise(), thunk))

export default createStore(reducers, middleware)
