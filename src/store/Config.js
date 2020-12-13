import { combineReducers, createStore } from 'redux';

import MediaReducer from './MediaReducer'
import UIReducer from './UIReducer'

const rootReducer = combineReducers({
    MediaReducer, 
    UIReducer, 
  })
  
const store = createStore(rootReducer)

export default store