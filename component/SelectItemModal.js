import React,{ Component } from 'react';
import {View, Text, TouchableOpacity, Button, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import CoreFunction from '../core-function/core-function.js';
import AddNewTransactionModal from '../component/addNewTransactionModal.js';

class SelectItemModal extends Component{
    constructor(){
        super()

        this.coreFunction.setStateFromChild = this.coreFunction.setStateFromChild.bind(this);
    }


    state={
        Show:false,
        dataList:[],
        ShowAddNew:false
    }

    coreFunction = new CoreFunction();

    async componentWillUpdate(props){
        if(props.Show != this.state.Show){
            this.setState({Show:props.Show});
            if(props.Show){
                a = await this.coreFunction.getTransactionList(this.props.token,this.props.TabData.ID);
                addNew = {
                    label:'Add new group (+)',
                    ID:-1
                }
                a.unshift(addNew);
                this.setState({dataList:a});
            }
        }
    }

    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={300}
                animationOutTiming={500}
                backdropTransitionOutTiming={100}
                style={{
                    flexDirection: 'column',
                    justifyContent:'flex-end'
                }}
                animationType="slide"
                hasBackdrop={true}
                onBackdropPress={
                    ()=>this.setState({Show:false},()=>{
                        this.props.setStateFromChild("ShowSelectItem",false);
                        this.props.setStateFromChild("group",0);
                        this.props.setStateFromChild("groupName",'No Group');
                    })
                }
            >
                <AddNewTransactionModal 
                    Show={this.state.ShowAddNew}
                    setStateFromChildC={this.coreFunction.setStateFromChild}
                    TabData={this.props.TabData}
                    setStateFromChild={this.props.setStateFromChild}
                />
                <View
                    style={{
                        flex:0.5,
                        width:'100%',
                        backgroundColor:'white'
                    }}
                >
                    <BlockColumn size={0.15} />
                    <Text 
                        style={{
                            fontSize:20,
                            fontWeight:'bold',
                            textAlign:'center',
                            marginTop:'5%',
                            marginBottom:'5%'
                        }}
                    >
                        {this.props.label}
                    </Text>
                    <BlockColumn size={0.5} />
                    <ScrollView>
                    {  
                        this.state.dataList.map((data,key)=>{
                            return(
                            <View key={key} style={{minHeight:'5%',marginBottom:'3%'}}>
                                <TouchableOpacity
                                    onPress={
                                        ()=>{
                                            this.setState({Select:data.label},()=>{
                                                if(data.ID == -1){
                                                    this.setState({ShowAddNew:true});
                                                }else{
                                                    this.setState({Show:false},()=>{
                                                        this.props.setStateFromChild("group",data.ID);
                                                        this.props.setStateFromChild("groupName",data.label);
                                                        this.props.setStateFromChild("ShowSelectItem",false);
                                                    })
                                                }
                                                
                                            })
                                        }
                                    }
                                    style={{
                                        alignItems:'center'
                                    }}
                                >
                                    <View 
                                        style={{
                                            width:'80%',
                                            borderWidth:2,
                                            borderColor:'gray',
                                            paddingTop:'1%',
                                            paddingBottom:'1%'
                                        }}
                                    >
                                        <Text 
                                            style={{textAlign:'center'}}
                                        >
                                            {data.label} 
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            )
                        })
                    }
                    </ScrollView>
                    <BlockColumn size={0.6} />
                    <Button 
                        title="Close"
                        onPress={
                            ()=>{
                                this.setState({Show:false},()=>{
                                    this.props.setStateFromChild("ShowSelectItem",false);
                                });
                            }
                        }
                    />
                </View>
            </Modal>
        )
    }

}

export default SelectItemModal;