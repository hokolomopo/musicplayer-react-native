import { createStore } from 'redux';

import songReducer from './SongReducer'

export default createStore(songReducer)