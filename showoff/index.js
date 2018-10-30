import Module from 'microverse-core/lib/module'
import LocalNode from 'microverse-core/lib/localnode'

import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'

import store from './redux/store'

import Parallax from './components/Parallax'

import 'reset-css'
import './assets/theme.css'

const module = new Module({ id: 'showoff' })

const localPeer = (window.peer = new LocalNode({
  id: 'localPeer',
}))

const root = document.createElement('div')
document.body.appendChild(root)

const MainApp = connect(state => state)(() => {
  return (
    <Parallax
      peer={module._node}
      config={process.env.MICROVERSE_CONFIG}
      localPeer={localPeer}
    />
  )
})

render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  root,
)
