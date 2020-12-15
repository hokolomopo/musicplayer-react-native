export const SORT_SONGS_BY_VALUES = ["artist", "title"]

const initialState = { sortSongsBy:"title"}

//Redux reducer for UI elements
function UIReducer(state = initialState, action) {
    switch (action.type) {
    case 'SORT_SONGS_BY':
        nextState = {
            ...state, 
            sortSongsBy : action.value
        }
        return nextState
      return nextState  
    default:
      return state
    }
  }

  export default UIReducer

  