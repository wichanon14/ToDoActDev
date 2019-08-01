import React,{ Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

class AddActs extends Component{

    render(){
        return(
            <TouchableHighlight 
                onPress={
                    ()=>{
                        this.props.setShowAddActModal(true)
                    }
                }
            >
                <View style={styles.main}>
                    <Text style={styles.txt}>Add Activities</Text>
                </View>
            </TouchableHighlight>            
        );
    }

}

export default AddActs;

const styles = StyleSheet.create({
    main:{
        minWidth:'75%',
        flexDirection:'row',
        height:50,
        borderWidth:2
    },
    txt:{
        flex:1,
        textAlign:'center',
        alignSelf:'center',
        //marginTop:'3%'
    }
});