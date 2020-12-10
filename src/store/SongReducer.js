const initialState = { songs: [{title:"title", artist:"artist"}] , currentSong:{title:"title", artist:"artist"}, playState:"pause"}

function MediaReducer(state = initialState, action) {
    switch (action.type) {
    case 'UPDATE_SONGS':
        nextState = {
            ...state, 
            songs : action.value
        }
        return nextState
    case 'UPDATE_CURRENT_SONG':
        nextState = {
          ...state, 
            currentSong : action.value
        }
        return nextState
    case 'UPDATE_PLAY_STATE':
        nextState = {
            ...state, 
            playState : action.value
        }
        return nextState

    default:
      return state
    }
  }

  export default MediaReducer