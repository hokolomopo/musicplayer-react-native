import MediaModule from '../packages/Modules';

export const REPEAT_MODE = ["noRepeat", "repeatAll", "repeatOne"]

const initialState = {
    songs: [{title:"title", artist:"artist"}] ,
    currentSong:{title:"title", artist:"artist"},
    playState:"pause",
    shuffle:false,
    repeatMode:REPEAT_MODE[0],
    playingList:[]
}

export const MEDIA_ACTIONS = {
    updateSongs : "UPDATE_SONGS",
    updateCurrentSong : "UPDATE_CURRENT_SONG",
    updatePlayingList : "UPDATE_PLAYING_LIST",
    togglePlayState : "UPDATE_PLAY_STATE",
    nextSong : "NEXT_SONG",
    previousSong : "PREVIOUS_SONG",
    toggleShuffle : "TOGGLE_SHUFFLE",
    changeRepeatMode : "CHANGE_REPEAT_MODE",
}


function MediaReducer(state = initialState, action) {
    switch (action.type) {
        // UPDATE_SONGS
        case MEDIA_ACTIONS.updateSongs:
            nextState = {
                ...state, 
                songs : action.value
            }
            return nextState
        // UPDATE_CURRENT_SONG
        case MEDIA_ACTIONS.updateCurrentSong:
            nextState = {
            ...state, 
                currentSong : action.value
            }
            return nextState
        // UPDATE_PLAYING_LIST
        case MEDIA_ACTIONS.updatePlayingList:
            nextState = {
                ...state, 
                playingList : action.value.list,
                currentSong : action.value.currentSong
            }
            return nextState
        // UPDATE_PLAY_STATE
        case MEDIA_ACTIONS.togglePlayState:
            nextState = {
                ...state, 
                playState : action.value
            }
            return nextState
        // NEXT_SONG
        case MEDIA_ACTIONS.nextSong://TODO
            nextState = {
                ...state, 
            }
            return nextState
        // PREVIOUS_SONG
        case MEDIA_ACTIONS.previousSong://TODO
            nextState = {
                ...state, 
            }
            return nextState
        // TOGGLE_SHUFFLE
        case MEDIA_ACTIONS.toggleShuffle:
            nextState = {
                ...state, 
                shuffle : !state.shuffle
            }
            return nextState
        // CHANGE_REPEAT_MODE
        case MEDIA_ACTIONS.changeRepeatMode:
            let index = (REPEAT_MODE.indexOf(state.repeatMode) + 1) % REPEAT_MODE.length
            nextState = {
                ...state, 
                repeatMode : REPEAT_MODE[index]
            }
            return nextState
        
        default:
        return state
        }
  }

  export default MediaReducer