import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import MyMenuOption from '../util/MyMenuOption';
import SortByAlert from '../util/SortByAlert';
import {SORT_SONGS_BY_VALUES} from '../../store/UIReducer';

// File containing the actions that are added in the ActionBar for each tab
class _SongTabActions extends React.Component {

  
  constructor(props) {
    super(props)
  
    this.sortSongsByValues = []
    SORT_SONGS_BY_VALUES.forEach(item => this.sortSongsByValues.push({label:item}))

    this.state = {
        showSortByAlert: false
    }
  }


    render() {
      return(
        <View>
            <MyMenuOption
                onSelect={() => {
                    this.setState({showSortByAlert:true})
                    return false}} 
                message='Sort By...'/>            
            {this.state.showSortByAlert == false ? null : 
            //Do this instead of just using the show prop of SortByAlert bc it's buggy when we change the state when closing the alert, and
            //changing the prop with redux, leading to 2 Re-Render. Could optimize to have only 1 render, but it's just the AppBar so W/E
                <SortByAlert
                    show={true}
                    onAnimationEnd={(selected) => {
                    this.setState({showSortByAlert:false})
                    this.props.dispatch({ type: "SORT_SONGS_BY", value: this.sortSongsByValues[selected].label })
                    this.props.closeParentMenu()
                    }}
                    data={this.sortSongsByValues}
                    initial={this.sortSongsByValues.findIndex(item => item.label === this.props.sortBy) + 1}
                    onDismiss={() => {this.props.closeParentMenu()}}
                />}
       </View>
)
    }
  }


const mapStateToProps = (state) => {
    return {
      sortBy: state.UIReducer.sortSongsBy
    }
  }
  

export const SongTabActions = connect(mapStateToProps, null)(_SongTabActions)
