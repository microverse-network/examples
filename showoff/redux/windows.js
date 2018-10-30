import EarnWindow from '../components/EarnWindow'
import TryWindow from '../components/TryWindow'
// import QueryWindow from '../components/QueryWindow'
// import ComputeWindow from '../components/ComputeWindow'
// import DistributeWindow from '../components/DistributeWindow'
import CallLogWindow from '../components/CallLogWindow'
import ComputeResultWindow from '../components/ComputeResultWindow'
import DistributeResultWindow from '../components/DistributeResultWindow'
import StoryWindow from '../components/StoryWindow'

const windowsInitial = {
  // ComputeWindow,
  ComputeResultWindow,
  // DistributeWindow,
  DistributeResultWindow,
  StoryWindow,
  // QueryWindow,
  EarnWindow,
  TryWindow,
  CallLogWindow,
}

export const windows = (state = windowsInitial, action) => {
  switch (action.type) {
    case 'REGISTER_WINDOW': {
      const { id, WindowComponent } = action.payload

      state = { ...state, [id]: WindowComponent }
      break
    }
  }

  return state
}

const windowState = {
  primary: [{ id: 'StoryWindow', props: {} }],
  secondary: [{ id: 'CallLogWindow', props: {} }],
  active: 'StoryWindow',
}

export const windowPlacements = (state = windowState, { type, payload }) => {
  switch (type) {
    case 'SHOW_WINDOW': {
      const { id, placement, props } = payload
      const active = placement === 'primary' ? id : state.active
      state = {
        ...state,
        // push id and props to the stack
        [placement]: [...state[placement], { id, props }],
        active,
      }
      break
    }

    case 'CLOSE_WINDOW': {
      const { id } = payload
      const active = id === state.active ? '' : state.active

      const primary =
        id === 'StoryWindow'
          ? []
          : state.primary.find(w => w.id === id)
            ? [{ id: 'StoryWindow', props: {} }]
            : state.primary

      const secondary =
        id === 'CallLogWindow'
          ? []
          : id === 'TryWindow'
            ? [{ id: 'CallLogWindow', props: {} }]
            : state.secondary.find(w => w.id === id)
              ? [{ id: 'CallLogWindow', props: {} }]
              : state.secondary

      state = { primary, secondary, active }
      break
    }

    case 'CLOSE_ALL_WINDOWS': {
      const { placement } = payload
      const active = placement === 'primary' ? '' : state.active

      // if there is a placement specified, only empty the specified stack.
      state = placement
        ? { ...state, [placement]: [], active }
        : { primary: [], secondary: [], active }
      break
    }
  }

  return state
}

export const registerWindow = (id, WindowComponent) => ({
  type: 'REGISTER_WINDOW',
  payload: { id, WindowComponent },
})

export const showWindow = (id, placement, props) => ({
  type: 'SHOW_WINDOW',
  payload: { id, placement, props },
})

export const closeWindow = id => ({
  type: 'CLOSE_WINDOW',
  payload: { id },
})

export const closeAllWindows = (placement = null) => ({
  type: 'CLOSE_ALL_WINDOWS',
  payload: { placement },
})

export const getWindow = state => ({ id, props }) => ({
  id,
  WindowComponent: state.windows[id],
  props,
})

export const getWindows = state => placement =>
  state.windowPlacements[placement].map(getWindow(state))
