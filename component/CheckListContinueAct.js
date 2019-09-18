import React, { Component } from 'react';
import {Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';

class CheckListContinueAct extends Component{

    state = {
        Show:false
    }

    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={10}
                animationOutTiming={500}
                backdropTransitionOutTiming = {10}
            >
                <BlockColumn size={2} />
                <View style={styles.bodyModal}>
                    <Button 
                        title="Close"
                        onPress={()=>{
                            this.setState({Show:!this.state.Show});
                        }}
                    />
                </View>
            </Modal>
        )
    }

}

export default CheckListContinueAct;

const styles = StyleSheet.create({

    bodyModal:{
        minHeight:'20%',
        backgroundColor:'white'
    }

});