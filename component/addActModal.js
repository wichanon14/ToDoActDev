import React, {Component} from 'react';
import {View, Button, Text, TextInput, StyleSheet, TouchableOpacity,
    ScrollView, Image, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import { Switch } from 'react-native-switch';
import BlockColumn from '../component/blockcolumn.js';
import CloneIcon from '../assets/clone-icon.png';
import CloneDateModal from '../component/cloneDateModal.js';
import ResetContinueActivity from '../component/resetContinueActivity.js';

class AddActModal extends Component{
    constructor(props){
        super(props);
        this.setShowParentCloneModal = this.setShowParentCloneModal.bind(this);
        this.props.setShowAddActModal = this.props.setShowAddActModal.bind(this);
        this.setShowAddActModalChild = this.setShowAddActModalChild.bind(this);
        this.props.setReRender = this.props.setReRender.bind(this);
        this.props.setResetContinue = this.props.setResetContinue.bind(this);
        this.ShowContinueNumber = this.ShowContinueNumber.bind(this);
        this.setLastestDay = this.setLastestDay.bind(this);
    }

    state = {
        Show : false,
        ShowCloneModal:false,
        ActivityName:'',
        isContinue:false,
        last_day:'',
        displayAutocomplete:'none',
        listAutocompleteAct:[],
        token:''
    }

    setShowAddActModalChild(state){
        this.setState({Show:state});
    }

    setShowParentCloneModal(state){
        this.setState({ShowCloneModal:state});
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
            this.setState({isContinue:false},()=>{
                this.setState({isReset:false});
                this.setState({ResetComponent:<View></View>});
            });
            this.setState({last_day:''});
            this.setState({ActivityName:''});
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
	            "act_name":this.state.ActivityName
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.setState({Show:false})
            this.props.setShowAddActModal(false);
            this.props.addActToList(response['ID']);
            
        })
    }

    ShowContinueNumber(){
        
        if(this.state.isContinue){
            fetch('http://165.22.242.255/toDoActService/action.php',{
                method:'POST',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "action":"get_latest_date_act",
                    "token":this.state.token,
                    "activity_name":this.state.ActivityName,
                    "acttivity_date":(this.props.selectDate.getFullYear()+'-'+(this.props.selectDate.getMonth()+1)+'-'+this.props.selectDate.getDate())
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                //console.log('response >> ',response);
                this.setState({last_day:'#'+response.last_day});
                
            })
        }else{
            this.setState({last_day:''});
        }
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
                    "keyword":this.state.ActivityName
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                
                if(response.length>0 && this.state.ActivityName.length>0){
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
        
        this.setState({ActivityName:item.activity_name},
            ()=>this.setState({displayAutocomplete:'none'}))
    }

    setLastestDay(state){
        this.setState({last_day:state});
    }

    render(){
        return(
            <Modal
                isVisible={this.state.Show}
                animationInTiming={10}
                animationOutTiming={500}
                backdropTransitionOutTiming = {10}
                >
                <CloneDateModal 
                    Show={this.state.ShowCloneModal}
                    setShowParentCloneModal={this.setShowParentCloneModal}
                    setShowAddActModal={this.props.setShowAddActModal}
                    setShowAddActModalChild = {this.setShowAddActModalChild}
                    selectDate={this.props.selectDate}
                    setReRender={this.props.setReRender}
                    TabData={this.props.TabData}
                    />
                <BlockColumn size={0.2}/>
                <View style={styles.bodyModal}>                 
                    <BlockColumn size={0.05}/>
                    <View style={{height:30,flexDirection:'row'}}>
                        <BlockColumn size={0.95}/>

                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({ShowCloneModal:!this.state.ShowCloneModal});
                            }}
                        >
                            <View style={{alignItems:'center',opacity:0.6}}>
                                <Image source={CloneIcon} style={{width:20,height:20}}/>
                                <BlockColumn size={0.2}/>
                                <Text style={{color:'gray',fontSize:10}}>Clone</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    
                    <BlockColumn size={0.05}/>
                    <View>
                        <Text style={styles.HeadCenter}>
                            Add Activity 
                        </Text>                        
                        <Text style={{textAlign:'center'}}>
                            {(this.props.parent)?'Parent List : '+this.props.parent:''}
                        </Text>
                    </View>
                    <BlockColumn size={0.2}/>

                    <TextInput 
                        style={{width:'70%',height: 40, 
                            borderColor: 'gray', borderWidth: 1,
                            alignSelf:'center',paddingLeft:10}}
                        onChangeText={(txt)=>{
                            this.setState({ActivityName:txt},()=>this.AutocompleteActivity())  
                        }}
                        value={this.state.ActivityName}
                        placeholder="Activity Name"
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
                    
                    <BlockColumn size={0.2}/>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <BlockColumn size={0.2}/>
                            <Text>
                                Continue Activity
                            </Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <BlockColumn size={0.2}/>                        
                            <Switch 
                                value={this.state.isContinue}
                                onValueChange={()=>{
                                    this.setState({isContinue:!this.state.isContinue},
                                        ()=>{
                                            this.setState({isReset:false});
                                            this.ShowContinueNumber();
                                            this.props.setIsContinue(this.state.isContinue);
                                        });
                                }}
                                activeText={'Yes'}
                                inActiveText={'No'}
                                circleSize={30}
                            />
                            <BlockColumn size={0.5}/>                
                            <Text
                                style={{textAlignVertical:'center'}}
                            >
                                {
                                    this.state.last_day
                                }
                            </Text>        
                        </View>
                        
                    </View>

                    <ResetContinueActivity 
                        Show={this.state.isContinue}
                        setResetContinue={this.props.setResetContinue}
                        ShowContinueNumber={this.ShowContinueNumber}
                        setLastestDay={this.setLastestDay}
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
                                this.props.setShowAddActModal(false);
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

export default AddActModal;

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