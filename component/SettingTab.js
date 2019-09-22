import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';

class SettingTab extends Component{


    logout(){
        AsyncStorage.setItem('token','');
        Actions.signin();
    }

    render(){
        return(
            <View style={style.Body}>
                <TouchableOpacity
                    onPress={()=>this.logout()}
                >   
                    <Text>Log out</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const style = StyleSheet.create({
    Body:{
        width:'98%',
        minHeight:'7%',
        justifyContent:'center',
        alignItems:'flex-end',
        marginTop:'5%',
        marginRight:'5%'
    }
})

export default SettingTab;