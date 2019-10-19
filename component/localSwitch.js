import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

class LocalSwitch extends Component{

    render(){
        return(
            <View
                style={{
                    width:'20%',height:30,
                    borderColor: 'gray', borderWidth: 1,
                    paddingLeft:10,marginLeft:'15%'
                }}
            >
                <TouchableWithoutFeedback
                    onPress={()=>{
                        console.log('switch press');
                    }}

                >
                    <View style={{borderWidth:1,borderColor:'red'}}>
                        <Text>AAAAA</Text>
                    </View>

                </TouchableWithoutFeedback>
            </View>
            
        )
    }


}

export default LocalSwitch;