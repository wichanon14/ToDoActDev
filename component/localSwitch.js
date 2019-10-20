import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

class LocalSwitch extends Component{

    state={
        payAction:true
    }

    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    this.setState({payAction:!this.state.payAction},()=>{
                        this.props.setStateFromChild("payAction",this.state.payAction);
                    })
                }}
            >
                <View style={{
                    width:'20%',marginLeft:'15%',borderWidth:1
                }}>
                    <Text style={{textAlign:'center',backgroundColor:(this.state.payAction)?'red':'white',
                        color:(this.state.payAction)?'white':'black',borderBottomWidth:0.5}}>
                        Pay
                    </Text>
                    <Text style={{textAlign:'center',backgroundColor:(!this.state.payAction)?'green':'white',
                        color:(!this.state.payAction)?'white':'black',borderTopWidth:0.5}}>
                        Earn
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            
        )
    }


}

export default LocalSwitch;