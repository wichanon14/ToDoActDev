import React,{ Component } from 'react';
import {View, Text, TouchableOpacity, Button, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';

class SelectItem extends Component{

    state={
        Show:false,
        Select:this.props.label,
        TabTypeList:[
        {
            type:0,
            type_label:'List'
        },
        {
            type:1,
            type_label:'Daily'
        },
        {
            type:2,
            type_label:'Monthly'
        },
        {
            type:3,
            type_label:'Yearly'
        },
        {
            type:4,
            type_label:'Ledger'
        }]
    }

    render(){
        return(
            <TouchableOpacity
                style={{
                    width:(this.props.width)?this.props.width:'100%',
                    height:(this.props.height)?this.props.height:'10%',
                    borderWidth:2,
                    borderColor:'gray',
                    marginLeft:(this.props.left)?this.props.left:'10%',
                    paddingLeft:'1%'
                }}
                onPress={
                    ()=>{
                        this.setState({Show:true});
                    }
                }
            >
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
                        ()=>this.setState({Show:false})
                    }
                >
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
                            {"Select Tab Type"}
                        </Text>
                        <BlockColumn size={0.5} />
                        <ScrollView>
                        {  
                            this.state.TabTypeList.map((data,key)=>{
                                return(
                                <View key={key} style={{minHeight:'5%',marginBottom:'3%'}}>
                                    <TouchableOpacity
                                        onPress={
                                            ()=>{
                                                this.setState({Select:data.type_label},()=>{
                                                    this.props.setTypeTab(data.type);
                                                    this.setState({Show:false})
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
                                                {data.type_label+" Type"} 
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
                                    this.setState({Show:false});
                                }
                            }
                        />
                    </View>
                </Modal>
                <Text style={{textAlign:'center'}}>
                    {(this.state.Select)?this.state.Select:'Sample'}
                </Text>
            </TouchableOpacity>
        )
    }

}

export default SelectItem;