import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, AsyncStorage ,Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BlockColumn from './blockcolumn.js';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import backgroundIcon from '../assets/backgroundIcon.png';
import logout from '../assets/logout.png';
import CoreFunction from '../core-function/core-function.js';

class SettingTab extends Component{

    coreFunction = new CoreFunction()

    state={
        token:''
    }

    componentWillMount(){
        AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.setState({token:value});
            }else{
                Actions.signin();
            }
        });
    }

    logout(){
        AsyncStorage.setItem('token','');
        Actions.signin();
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 10],
        });

        //console.log(result);

        if(!result.cancelled){
            value = this.props.getBackground;
            FileSystem.deleteAsync(value, {
                idempotent:true
            })
            var nameIndex = result.uri.lastIndexOf("/");
            var fileName = result.uri.substr(nameIndex+1,50);

            FileSystem.copyAsync({
                from:result.uri,
                to:FileSystem.documentDirectory+fileName
            })
            this.props.setMainBackground(FileSystem.documentDirectory+fileName);
            //AsyncStorage.setItem('backgroundImg',FileSystem.documentDirectory+fileName);
            this.updateImgBackground(fileName)
            
        }

    }

    updateImgBackground(path){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"updateImageBackground",
                "token":this.state.token,
                "path":path
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            console.log(response);
        })
    }

    render(){

        return(
            <View style={style.Body}>
                <TouchableOpacity
                    onPress={()=>{
                        this._pickImage();
                    }}
                >   
                    <Image source={backgroundIcon} style={{width: 25, height: 25,opacity:0.8}}/>
                </TouchableOpacity>
                <BlockColumn size={0.05} />
                <TouchableOpacity
                    onPress={()=>this.logout()}
                >   
                    <Image source={logout} style={{width: 25, height: 25,opacity:0.8}}/>
                </TouchableOpacity>
                <BlockColumn size={0.05} />
            </View>
        )
    }

}

const style = StyleSheet.create({
    Body:{
        width:'98%',
        minHeight:'7%',
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'flex-end',
        marginTop:'5%',
        marginRight:'5%'
    }
})

export default SettingTab;