import React,{ Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class AddActs extends Component{

    render(){
        return(
            <TouchableOpacity 
                onPress={
                    ()=>{
                        this.props.setShowAddActModal(true);
                        this.props.setParentList('',0);
                    }
                }
            >
                <View style={styles.main}>
                    <Text style={styles.txt}>Add Activities</Text>
                </View>
            </TouchableOpacity>            
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