import { combineReducers, createStore } from 'redux';

import MediaReducer from './SongReducer'
import UIReducer from './UIReducer'

const rootReducer = combineReducers({
    MediaReducer, 
    UIReducer, 
  })
  
const store = createStore(rootReducer)

export default store