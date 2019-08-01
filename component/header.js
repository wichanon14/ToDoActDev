import React,{ Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';

class Header extends Component{

    render(){
        let date = new Date();
        return(
            <View style={styles.Header}>
                <Text style={styles.HeadCenter}>
                    Daily Activity List
                </Text>
                <Text>
                    {date.toDateString("MMMM yyyy")}
                </Text>
            </View>
        );
    }

}

export default Header;

const styles = StyleSheet.create({
    Header:{
        flex:1,
        borderWidth:2,
        alignSelf:'center',
        justifyContent:'center'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold'
    },
    TextCenter:{
        textAlign:'center'
    }
});