import MediaModule from '../packages/Modules';

export const REPEAT_MODE = {
    noRepeat : "noRepeat",
    repeatAll : "repeatAll",
    repeatOne : "repeatOne",
}

const initialState = {
    songs: [{title:"title", artist:"artist"}] ,
    currentSong:{title:"title", artist:"artist"},
    playState:"pause",
    shuffle:false,
    repeatMode:REPEAT_MODE.noRepeat,
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

// Redux reducer for Media actions/states 
function MediaReducer(state = initialState, action) {
    //TODO : Communicate with the Android code when an action is taken (eg. do MediaModule.next())
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
        case MEDIA_ACTIONS.nextSong:
            let currentIndexN = state.playingList.indexOf(state.currentSong)
            
            currentIndexN = currentIndexN + 1
            if(currentIndexN == state.playingList.length && state.repeatMode == REPEAT_MODE.repeatAll)
                currentIndexN = 0
            else if(currentIndexN == state.playingList.length)
                currentIndexN = state.playingList.length - 1
            nextState = {
                ...state, 
                currentSong : state.playingList[currentIndexN]
            }
            return nextState
        // PREVIOUS_SONG
        case MEDIA_ACTIONS.previousSong:
            let currentIndex = state.playingList.indexOf(state.currentSong)

            currentIndex = currentIndex - 1
            if(currentIndex < 0 && state.repeatMode == REPEAT_MODE.repeatAll)
                currentIndex = state.playingList.length - 1
            else if(currentIndex < 0)
                currentIndex = 0

            nextState = {
                ...state, 
                currentSong : state.playingList[currentIndex]
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
            let repeatMode
            if(state.repeatMode == REPEAT_MODE.noRepeat)
                repeatMode = REPEAT_MODE.repeatAll
            else if(state.repeatMode == REPEAT_MODE.repeatAll)
                repeatMode = REPEAT_MODE.repeatOne
            else if(state.repeatMode == REPEAT_MODE.repeatOne)
                repeatMode = REPEAT_MODE.noRepeat

            nextState = {
                ...state, 
                repeatMode : repeatMode
            }
            return nextState
        
        default:
        return state
        }
  }

  export default MediaReducer