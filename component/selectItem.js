import React,{ Component } from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';

class SelectItem extends Component{

    state={
        Show:false,
        Select:this.props.label
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
                                textAlign:'center'
                            }}
                        >
                            {"Select Tab Type"}
                        </Text>
                        <BlockColumn size={0.15} />
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    this.setState({Select:'Daily'},()=>{
                                        this.props.setTypeTab(1);
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
                                    Daily Type
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <BlockColumn size={0.1} />
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    this.setState({Select:'List'},()=>{
                                        this.props.setTypeTab(0);
                                        this.setState({Show:false});
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
                                <Text style={{textAlign:'center'}}>
                                    List Type
                                </Text>
                            </View>
                        </TouchableOpacity>
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