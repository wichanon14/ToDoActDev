import React,{ Component } from 'react';
import {View, Text, StyleSheet, Button, AsyncStorage,TextInput} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import CoreFunction from '../core-function/core-function.js';

class AddNewTransactionModal extends Component{

    state={
        Show:false,
        GroupName:'',
        token:''
    }

    coreFunction = new CoreFunction();

    componentWillMount(){
        AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.setState({token:value});
            }else{
                Actions.signin();
            }
        });
    }

    componentWillUpdate(props){
        if(props.Show != this.state.Show){
            this.setState({Show:props.Show});
        }
    }

    render(){
        return(
            <Modal
                isVisible={this.props.Show}
                animationInTiming={300}
                animationOutTiming={500}
                backdropTransitionOutTiming={100}
                style={{
                    justifyContent:'center',
                    alignItems:'center'
                }}
                animationType="slide"
                hasBackdrop={true}
                onBackdropPress={
                    ()=>{
                        this.setState({Show:false});
                        this.props.setStateFromChildC("ShowAddNew",false);
                    }
                }
            >
                <View style={{backgroundColor:'white',height:'50%',width:'80%'}}>
                    <BlockColumn size={0.2} />
                    <Text style={styles.HeadCenter}>
                        Add New Group
                    </Text>                   
                    <BlockColumn size={0.3} />     
                    <TextInput 
                        style={{width:'70%',height: 40, 
                            borderColor: 'gray', borderWidth: 1,
                            marginLeft:'15%',paddingLeft:10}}
                        onChangeText={(txt)=>{
                            this.setState({GroupName:txt})  
                        }}
                        value={this.state.GroupName}
                        placeholder="Group Name"
                    />
                    <BlockColumn size={0.3} />
                    <View style={{flexDirection:'row'}}>
                        <BlockColumn size={0.5}/>
                        <Button 
                            title="Add"
                            onPress={
                                async ()=>{
                                    b = await this.coreFunction.createGroup(this.state.token,this.state.GroupName,this.props.TabData.ID)
                                    this.props.setStateFromChild("group",b.ID);
                                    this.props.setStateFromChild("groupName",b.groupName);
                                    this.props.setStateFromChildC("ShowAddNew",false);
                                    this.props.setStateFromChild("ShowSelectItem",false);
                                }
                            }
                        />
                        <BlockColumn size={0.5} />
                        <Button 
                            title="Close"
                            onPress={
                                ()=>{
                                    this.props.setStateFromChildC("ShowAddNew",false);
                                }
                            }
                        />
                        <BlockColumn size={0.5}/>
                    </View>
                    <BlockColumn size={0.2}/>
                </View>

            </Modal>
        )
    }


}

export default AddNewTransactionModal;

const styles = StyleSheet.create({
    bodyModal:{
        //flex:1,
        minHeight:'100%',
        backgroundColor:'white'
    },
    HeadCenter:{
        fontSize:20,
        fontWeight:'bold',
        alignSelf:'center',
        justifyContent:'center'
    },
    bodyModalDate:{
        minHeight:'50%',
        backgroundColor:'white'
    }
})