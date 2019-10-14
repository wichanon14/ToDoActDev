import React, {Component} from 'react';
import { View, AsyncStorage, Text, TextInput, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import SelectItem from '../component/selectItem.js';

class ModalCreateTab extends Component{
    constructor(props){
        super(props);
        this.setTypeTab = this.setTypeTab.bind(this);

    }

    state={
        Show:false,
        Name:'',
        Type:0,
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

    componentWillUpdate(props){
        if(this.state.Show != props.Show){
            this.setState({Show:props.Show},()=>{
                this.setState({Name:''});
            });
        }
    }

    setTypeTab(Type){
        this.setState({Type:Type});
    }

    createTab(TabName){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"create_tab",
                "TabName":TabName,
                "Type":this.state.Type,
                "token":this.state.token
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            console.log(response);
            this.setState({Show:false},()=>{
                this.props.setShowModalCreateTab(false);
                this.props.getTabList();
            });
        })
    }

    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={10}
                animationOutTiming={500}
                backdropTransitionOutTiming={100}
            >
                <View style={styles.bodyModal}>

                    <BlockColumn size={0.25} />
                    <View style={{alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={styles.header}>Create Tab Activity</Text>
                    </View>
                    <BlockColumn size={0.2} />
                    <View style={{
                        paddingLeft:10,
                        marginLeft:20,
                        marginRight:20,
                        borderWidth:2,
                        borderColor:'gray'}}>
                        <TextInput 
                            placeholder="Tab Activity Name"
                            onChangeText={
                                (txt)=>{
                                    this.setState({Name:txt},()=>{
                                        console.log('txt >> ',txt);
                                    });
                                }
                            }
                        />
                    </View>
                    <BlockColumn size={0.2} />
                    <SelectItem 
                        width="30%"
                        label="Type"
                        left="8%"
                        setTypeTab={this.setTypeTab}
                    />
                    <BlockColumn size={0.2} />
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Button 
                            title="Create"
                            onPress={()=>{this.createTab(this.state.Name)}}
                        />
                        <BlockColumn size={0.2} />
                        <Button 
                            title="Close"
                            onPress={
                                ()=>{
                                    this.setState({Show:false});
                                    this.props.setShowModalCreateTab(false);
                                }
                            }
                        />
                    </View>
                </View>

            </Modal>
        );
    }


}

export default ModalCreateTab;

const styles = StyleSheet.create({

    bodyModal:{
        minHeight:'50%',
        backgroundColor:'white'
    },
    header:{
        fontSize:30,
        fontWeight:'bold'
    }

})