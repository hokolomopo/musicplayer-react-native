import AwesomeAlert from 'react-native-awesome-alerts';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import RadioButtonRN from './RadioButtonRN';

class SortByAlert extends React.Component {
    
    AlertView = () =>{
  
      return(<View style={{width:300}}>
          <RadioButtonRN
            data={this.props.data}
            box={true}
            initial={this.props.initial}
            duration={100}
            textStyle={styles.textStyle}
            onAnimationEnd={this.props.onAnimationEnd}
          />
      </View>)
    }


    render() {
        //TODO maybe add cancel button but w/e
      return(
        <AwesomeAlert
            show={this.props.show}
            showProgress={false}
            title="Sort Songs by : "
            showCancelButton={false}
            customView={this.AlertView()}
            titleStyle={styles.titleStyle}
            onDismiss={this.props.onDismiss}
        />
      )
    }
  }

const styles = StyleSheet.create({
    titleStyle:{
        fontSize:22,
        marginBottom:8, 
        alignSelf:"flex-start"
    },
    textStyle:{
        fontSize:22,
        lineHeight:23,
        marginLeft:10
    }
});

SortByAlert.propTypes = {
    onAnimationEnd: PropTypes.func,
    data : PropTypes.array,
    show: PropTypes.bool,
    initial: PropTypes.number
};

SortByAlert.defaultProps = {
    onAnimationEnd: null,
    data: [],
    show: false,
    initial: -1
};

export default SortByAlert