import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BlockColumn from '../blockcolumn';

class BlockReport extends Component{

    render(){
        return(
            <View style={{flexDirection:'row'}}>
                <View style={{width:'50%',borderBottomWidth:1,paddingLeft:15,paddingVertical:10}}>
                    <BlockColumn size={0.5}/>
                    <Text>
                        {this.props.label}
                    </Text>
                </View>
                <View style={{width:'50%',borderBottomWidth:1,alignItems:'center',paddingVertical:10}}>
                    <BlockColumn size={0.5}/>
                    <Text>
                        {this.props.value}
                    </Text>
                </View>
            </View>
        )
    }


}

export default BlockReport;