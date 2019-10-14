import React, { Component } from 'react';
import { Text, View, AsyncStorage, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import ModalCreateTab from '../component/modalCreateTab.js';

class ModalTabSelect extends Component{
    constructor(props){
        super(props);
        this.setShowModalCreateTab = this.setShowModalCreateTab.bind(this);
        this.getTabList = this.getTabList.bind(this);
    }

    state={
        Show:false,
        ShowModalCreateTab:false,
        TabList:[],
        token:''
    }

    setShowModalCreateTab(state){
        this.setState({ShowModalCreateTab:state});
    }

    componentWillUpdate(props){
        if(props.Show != this.state.Show){
            this.setState({Show:props.Show});
            if(props.Show === true)
                this.getTabList();
        }

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

    getTabList(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"getTabList",
                "token":this.state.token
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            //console.log(response);
            if(response){
                this.setState({TabList:response});
            }
        })
    }

    deleteTab(obj){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache:'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"deleteTab",
                "ID":obj.ID,
                "token":this.state.token
            })
        })
        .then(function(response){
            return response.json();
        })
        .then(response=>{
            console.log(response);
            this.getTabList();
        })
    }

    ConfirmDelete(obj){
        Alert.alert(
            'Confirm Delete ',
            'Are you sure for delete '+'"'+obj.TabName+'"',
            [
                {text:'Yes',onPress:()=>this.deleteTab(obj)},
                {text:'No',onPress:()=>console.log('No')}
            ],
            {cancelable: true}
        )
    }

    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={10}
                animationOutTiming={500}
                backdropTransitionOutTimeing={100}
            >
                <ModalCreateTab 
                    Show={this.state.ShowModalCreateTab}
                    setShowModalCreateTab={this.setShowModalCreateTab}
                    getTabList={this.getTabList}
                />
                <View style={styles.bodyModal}>

                    <BlockColumn size={0.2} />
                    <View>
                        <Text style={styles.header}>
                            Activity Tab Select
                        </Text>
                    </View>
                    <ScrollView style={{marginTop:'10%',maxHeight:'70%'}}>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                            {
                                this.state.TabList.map((data,key)=>{
                                    return(
                                        <TouchableOpacity
                                            onPress={()=>
                                            {
                                                this.props.setTab(data);
                                                this.setState({Show:false});
                                                this.props.setShowModalTabSelect(false);
                                                this.props.setElementDate(data.type);
                                            }}
                                            key={key}
                                            style={{width:'80%',borderWidth:2,
                                            paddingLeft:10,marginBottom:15}}
                                            onLongPress={
                                                ()=>{
                                                    this.ConfirmDelete(data);
                                                }
                                            }
                                        >
                                            <Text style={styles.selectTab}>
                                                {data.TabName}
                                            </Text>    
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            
                            
                        </View>
                    </ScrollView>
                    <View style={{flexDirection:'row',
                        flex:1,
                        alignItems:'center',
                        justifyContent:'center'}}>
                        <Button 
                            title="Create Tab"
                            onPress={
                                ()=>{
                                    this.setState({ShowModalCreateTab:true});
                                }
                            }
                        />
                        <BlockColumn size={0.1} />
                        <Button 
                            title="Close"
                            onPress={
                                ()=>{
                                    this.setState({Show:false});
                                    this.props.setShowModalTabSelect(false);
                                }
                            }
                        />
                    </View>
                    <BlockColumn size={0.1} />
                </View>
            </Modal>
        )
    }

}

export default ModalTabSelect;

const styles = StyleSheet.create({
    bodyModal:{
        minHeight:'80%',
        backgroundColor:'white'
    },
    header:{
        fontSize:30,
        fontWeight:'bold',
        textAlign:'center'
    },
    selectTab:{
        fontSize:15,
        marginBottom:'2%',
        color:'black'
    }


});