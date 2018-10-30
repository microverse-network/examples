import { NAV_LINKS } from '../components/App'

export const INITIALIZE = '@drawing/INITIALIZE'
export const START_DRAWING = '@drawing/START'
export const STOP_DRAWING = '@drawing/STOP'
export const TOGGLE_DRAWING = '@drawing/STOP'
export const SHOW_SIDENAV = '@drawing/SIDENAV_SHOW'
export const HIDE_SIDENAV = '@drawing/SIDENAV_HIDE'
export const TOGGLE_SIDENAV = '@drawing/SIDENAV_TOGGLE'
export const SET_SLIDE = '@drawing/SET_SLIDE'
export const SET_SLIDE_COMPLETE = '@drawing/SET_SLIDE_COMPLETE'

const initial = {
  shouldDraw: true,
  sideNav: false,
  initialized: false,
  parallax: { offset: 0, dirty: false },
}

export const drawing = (state = initial, { type, payload } = {}) => {
  switch (type) {
    case INITIALIZE: {
      state = { ...state, initialized: true }
      break
    }

    case START_DRAWING: {
      state = { ...state, shouldDraw: true }
      break
    }

    case STOP_DRAWING: {
      state = { ...state, shouldDraw: false }
      break
    }

    case TOGGLE_DRAWING: {
      state = { ...state, shouldDraw: !state.shouldDraw }
      break
    }

    case SHOW_SIDENAV: {
      state = { ...state, sideNav: true }
      break
    }

    case HIDE_SIDENAV: {
      state = { ...state, sideNav: false }
      break
    }

    case TOGGLE_SIDENAV: {
      state = { ...state, sideNav: !state.sideNav }
      break
    }

    case SET_SLIDE: {
      const { offset } = payload
      document.location.hash = NAV_LINKS[offset].hash
      const dirty = offset !== state.parallax.offset
      state = { ...state, parallax: { offset, dirty } }
      break
    }

    case SET_SLIDE_COMPLETE: {
      state = {
        ...state,
        shouldDraw: state.parallax.offset === 0,
        parallax: { ...state.parallax, dirty: false },
      }
      break
    }
  }

  return state
}

export const initialize = () => ({
  type: INITIALIZE,
})

export const startDrawing = () => ({
  type: START_DRAWING,
})

export const stopDrawing = () => ({
  type: STOP_DRAWING,
})

export const toggleDrawing = () => ({
  type: TOGGLE_DRAWING,
})

export const showSideNav = () => ({
  type: SHOW_SIDENAV,
})

export const hideSideNav = () => ({
  type: HIDE_SIDENAV,
})

export const toggleSideNav = () => ({
  type: TOGGLE_SIDENAV,
})

export const setSlide = offset => ({
  type: SET_SLIDE,
  payload: { offset },
})

export const setSlideComplete = () => ({
  type: SET_SLIDE_COMPLETE,
})
