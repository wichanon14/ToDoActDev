import React, {Component} from 'react';
import {View, Button, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from './blockcolumn.js';
import LocalSwitch from './localSwitch.js';
import CoreFunction from '../core-function/core-function.js';

class AddTransModal extends Component{
    constructor(props){
        super(props);
        this.props.setReRender = this.props.setReRender.bind(this);
    }

    coreFunction = new CoreFunction();

    state = {
        Show : false,
        TransactionName:'',
        displayAutocomplete:'none',
        listAutocompleteAct:[],
        token:'',
        amount:"1",
    }

    componentWillMount(){
        this.setState({Show:this.props.Show});

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
            this.setState({TransactionName:''});
        }
        
    }

    AddActivity(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_act",
	            "act_name":this.state.TransactionName
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.setState({Show:false})
            //Close Modal
            this.props.addActToList(response['ID']);
            
        })
    }

    AutocompleteActivity(){

        fetch('http://165.22.242.255/toDoActService/action.php',{
                method:'POST',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "action":"get_actMaster",
                    "keyword":this.state.TransactionName
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                
                if(response.length>0 && this.state.TransactionName.length>0){
                    this.setState({displayAutocomplete:'flex'});
                    this.setState({listAutocompleteAct:[]});
                    this.setState({listAutocompleteAct:response});
                }else{
                    this.setState({displayAutocomplete:'none'});
                    this.setState({listAutocompleteAct:[]});
                }
                
                
            })

    }

    onSelectAutocomplete(item){
        
        this.setState({TransactionName:item.activity_name},
            ()=>this.setState({displayAutocomplete:'none'}))
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
                            Add Transaction
                        </Text>                        
                        <Text style={{textAlign:'center'}}>
                            {(this.props.parent)?'Parent List : '+this.props.parent:''}
                        </Text>
                    </View>
                    <BlockColumn size={0.2}/>

                    <LocalSwitch 
                    
                    />

                    <BlockColumn size={0.1}/>
                    <TextInput 
                        style={{width:'70%',height: 40, 
                            borderColor: 'gray', borderWidth: 1,
                            marginLeft:'15%',paddingLeft:10}}
                        onChangeText={(txt)=>{
                            this.setState({TransactionName:txt},()=>this.AutocompleteActivity())  
                        }}
                        value={this.state.TransactionName}
                        placeholder="Transaction Name"
                    />
                    
                    <ScrollView style={{
                        maxHeight:'30%',
                        display:this.state.displayAutocomplete}}>
                        {
                            this.state.listAutocompleteAct.map((item,i)=>{
                                return(
                                    <TouchableOpacity
                                        style={{width:'70%',height: 40, 
                                            borderColor: 'gray', borderWidth: 1,
                                            alignSelf:'center',justifyContent:'center',
                                            backgroundColor:'black'}}
                                        key={item.ID}
                                        onPress={
                                            ()=>this.onSelectAutocomplete(item)
                                        }
                                    >
                                        <Text style={{textAlign:'center',color:'white'}}>
                                            {item.activity_name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        }
                        
                    </ScrollView>
                    
                    <BlockColumn size={0.1}/>
                    <TextInput 
                        placeholder="amount"
                        style={{width:'70%',height: 40, 
                        borderColor: 'gray', borderWidth: 1,
                        marginLeft:'15%',paddingLeft:10}}
                        onChangeText={(txt)=>{
                            this.setState({amount:txt});
                        }}
                        value={this.state.amount}
                    />

                    <BlockColumn size={0.3}/>
                    <View style={{flexDirection:'row'}}>
                        
                        <BlockColumn size={0.5}/>
                        <Button 
                            title="ADD"
                            onPress={async ()=>{
                                d = await this.coreFunction.CreateActivity(this.state.TransactionName);
                                console.log('d >> ',d);
                                this.props.addActToList(d,this.state.amount);
                                this.setState({Show:false})
                                this.props.setStateFromChild('ShowAddTransModal',false);
                            }}
                        />
                        <BlockColumn size={0.5}/>
                        <Button 
                            title="Close"
                            onPress={()=>{
                                this.setState({Show:false})
                                this.props.setStateFromChild('ShowAddTransModal',false);
                                //send signal to Main The modal was close
                            }}
                        />
                        <BlockColumn size={0.5}/>
                    </View>
                    <BlockColumn size={0.3}/>
                </View>
                <BlockColumn size={0.2}/>
            </Modal>
            
        );
    }

}

export default AddTransModal;

const styles = StyleSheet.create({
    bodyModal:{
        //flex:1,
        minHeight:'100%',
        backgroundColor:'white'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold',
        alignSelf:'center',
        justifyContent:'center'
    },
    bodyModalDate:{
        minHeight:'50%',
        backgroundColor:'white'
    }
})