import React, {Component} from 'react';
import {View, Button, Text, TextInput, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';

class AddActModal extends Component{

    state = {
        Show : false,
        ActivityName:''
    }

    componentWillMount(){
        this.setState({Show:this.props.Show});
    }

    componentWillUpdate(props){
        if(props.Show != this.state.Show){
            console.log('will mount >> ',props.Show);
            this.setState({Show:props.Show});
        }
    }

    AddActivity(){
        fetch('http://10.0.0.212/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_act",
	            "act_name":this.state.ActivityName
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            console.log('ID >> ',response['ID']);
            this.setState({Show:false})
            this.props.setShowAddActModal(false);
            this.props.addActToList(response['ID']);
            
        })
    }


    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={10}
                animationOutTiming={500}
                backdropTransitionOutTiming = {10}
                >
                <BlockColumn size={0.2}/>
                <View style={styles.bodyModal}>
                    <BlockColumn size={0.2}/>
                    <View>
                        <Text style={styles.HeadCenter}>
                            Add Activity 
                        </Text>
                    </View>
                    <BlockColumn size={0.2}/>

                    <TextInput 
                        style={{width:'70%',height: 40, 
                            borderColor: 'gray', borderWidth: 1,
                            alignSelf:'center',paddingLeft:10}}
                        onChangeText={(txt)=>{
                            this.setState({ActivityName:txt})
                            console.log('txt >> ',this.state.ActivityName);
                        }}
                        value={this.setState.ActivityName}
                        placeholder="Activity Name"
                    />
                    <BlockColumn size={0.3}/>
                    <View style={{flexDirection:'row'}}>
                        
                        <BlockColumn size={0.5}/>
                        <Button 
                            title="ADD"
                            onPress={()=>{
                                this.AddActivity();
                            }}
                        />
                        <BlockColumn size={0.5}/>
                        <Button 
                            title="Close"
                            onPress={()=>{
                                this.setState({Show:false})
                            }}
                        />
                        <BlockColumn size={0.5}/>
                    </View>
                </View>
                <BlockColumn size={0.5}/>
            </Modal>
            
        );
    }

}

export default AddActModal;

const styles = StyleSheet.create({
    bodyModal:{
        flex:1,
        backgroundColor:'white'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold',
        alignSelf:'center',
        justifyContent:'center'
    }
})