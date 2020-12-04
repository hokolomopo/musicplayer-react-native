const initialState = { songs: [] }

function updateSongs(state = initialState, action) {
    switch (action.type) {
    case 'UPDATE_SONGS':
        nextState = {
            songs : action.value
        }
        return nextState
    default:
      return state
    }
  }

  export default updateSongs