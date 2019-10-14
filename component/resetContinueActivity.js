import React,{ Component } from 'react';
import {View, Button, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Image, AsyncStorage } from 'react-native';
import { CheckBox } from 'react-native-elements';
import BlockColumn from '../component/blockcolumn.js';

class ResetContinueActivity extends Component{

    state={
        isReset:false,
        isShow:false
    }

    componentWillUpdate(props){
        if(this.state.isShow!=props.Show){
            this.setState({isShow:props.Show});
            this.setState({isReset:false});
            this.props.setResetContinue(false);
        }
    }

    render(){
        return(
            <View style={{display:(this.state.isShow)?'flex':'none',marginLeft:'8%'}}>
                <BlockColumn size={0.15}/>
                <View>
                    <View style={{flexDirection:'row'}}>
                        <BlockColumn size={0.2}/>                        
                        <CheckBox
                            title="Reset Continue Activity"
                            checked={this.state.isReset}
                            onPress={()=>{
                                this.setState({isReset:!this.state.isReset},()=>{
                                    if(this.state.isReset){
                                        this.props.setLastestDay('#1');
                                    }else{
                                        this.props.ShowContinueNumber();
                                    }
                                    this.props.setResetContinue(this.state.isReset);
                                });
                            }}
                            containerStyle = {{minWidth:'70%',maxWidth:'70%',
                            backgroundColor:'transparent',borderWidth:0,flexWrap: 'wrap'}}
                        />    
                    </View>
                    
                </View>
            </View>
        )
    }
}

export default ResetContinueActivity;