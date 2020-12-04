import { createStore } from 'redux';

import updateSongs from './SongReducer'

export default createStore(updateSongs)