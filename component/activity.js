import React, {Component} from 'react';
import { Alert, View, StyleSheet, AsyncStorage } from 'react-native';
import { CheckBox } from 'react-native-elements';

class Activity extends Component{

    state={
        isCheck : false,
        token: ''
    }

    componentWillMount(){

        //get token from storage
        AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.setState({token:value});
            }else{
                Actions.signin();
            }
        });

        if(this.props.check==="0"){
            this.setState({isCheck:false});
        }else{
            this.setState({isCheck:true});
        }
    }

    selectList(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"select_list",
                "ID":this.props.id,
                "token":this.state.token
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.props.setReRender(true);
            
        })
    }

    deleteList(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"delete_list",
                "token":this.state.token,
                "ID":this.props.id
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            this.props.setReRender(true);
            
        })
    }

    ConfirmDelete(){
        Alert.alert(
            'Confirm Delete ',
            'Are you sure for delete '+this.props.label,
            [
                {text:'Yes',onPress:()=>this.deleteList()},
                {text:'No',onPress:()=>console.log('No')}
            ],
            {cancelable: true}
        )
    }

    render(){
        return(
            <View style={styles.body}>
                <CheckBox
                title={this.props.label}
                checked={this.state.isCheck}
                onPress={()=>{
                    this.selectList();
                }}
                onLongPress={()=>{
                    this.ConfirmDelete();
                }}
                containerStyle = {{minWidth:'70%',backgroundColor:'transparent',borderWidth:0}}
                />
            </View>
        )
    }

}

export default Activity;

const styles = StyleSheet.create({
    body:{
        flexDirection:'row',
        height:40,
        minWidth:'70%'
    }
})