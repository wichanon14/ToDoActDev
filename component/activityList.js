import React, {Component} from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, Text} from 'react-native';
import Activity from '../component/activity.js'
import Transaction from './Transaction.js';

class ActivityList extends Component{

    constructor(props){
        super(props);

        this.getActivityList = this.getActivityList.bind(this);
        this.props.setReRender = this.props.setReRender.bind(this)
        this.state={
            ActivityList:[],
            token:'',
            parentListSelect:0
        }
        this.props.setParentList = this.props.setParentList.bind(this);
        this.setParentListSelect = this.setParentListSelect.bind(this);
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
    }

    componentWillUpdate(props){
        
        if(props.reRender){
            this.props.setReRender(false);
            this.getActivityList();
        }
    }

    setParentListSelect(state){
        this.setState({parentListSelect:state});
    }

    getActivityList(){
        
        //console.log('tab type >> ',this.props.TabData.type)
        if(this.props.TabData.type === "1" || this.props.TabData.type === "4"){
            fetch('http://165.22.242.255/toDoActService/action.php',{
                method:'POST',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "action":"get_actList",
                    "token":this.state.token,
                    "date":(this.props.date.getFullYear()+'-'+(this.props.date.getMonth()+1)+'-'+this.props.date.getDate()),
                    "tabID":this.props.TabData.ID
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                //console.log(response);
                this.setState({ActivityList:[]},()=>{
                    this.setState({ActivityList:response});
                });
            })
        }else{
            fetch('http://165.22.242.255/toDoActService/action.php',{
                method:'POST',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "action":"get_actList",
                    "token":this.state.token,
                    "tabID":this.props.TabData.ID
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                
                this.setState({ActivityList:[]},()=>{
                    this.setState({ActivityList:response});
                });
            })
        }
        

    }

    sumfn(){
        sum = 0;
        this.state.ActivityList.forEach((data,i)=>{
            sum += parseInt(data.amount);
        })
        return sum;
    }

    render(){
        return(
            <View style={styles.body}>
                <ScrollView style={{display:(this.props.TabData.type!=4)?'flex':'none'}}>
                    {
                        this.state.ActivityList.map((data,key)=>{
                            return(
                                <Activity
                                    label={data.activity_name}
                                    id={data.ID}
                                    key={key}
                                    check = {data.is_complete}
                                    setReRender={this.props.setReRender}
                                    parentList={data.parentList}
                                    amountSubList={data.amountSubList}
                                    setParentList={this.props.setParentList}
                                    setShowHiddenList={this.state.parentListSelect}
                                    setParentListSelect={this.setParentListSelect}
                                />
                            )
                        })
                    }
                </ScrollView>
                <View style={{display:(this.props.TabData.type==4)?'flex':'none'}}>
                    <View style={{flex:1,minWidth:'80%',flexDirection:'row',
                        borderBottomWidth:1,maxHeight:'1%'}}></View>
                    <Text style={styles.Header}>
                        Balance : {this.sumfn()}
                    </Text>
                    <View style={{flex:1,minWidth:'80%',flexDirection:'row',
                        borderTopWidth:1,maxHeight:'1%'}}></View>
                    <ScrollView style={{marginTop:'3%',minHeight:'83%',maxHeight:'83%'}}>
                        {
                            this.state.ActivityList.map((data,key)=>{
                                return(
                                    <Transaction
                                        label={data.activity_name}
                                        list={data}
                                        id={data.ID}
                                        key={key}
                                        check = {data.is_complete}
                                        setReRender={this.props.setReRender}
                                        parentList={data.parentList}
                                        amountSubList={data.amountSubList}
                                        setParentList={this.props.setParentList}
                                        setShowHiddenList={this.state.parentListSelect}
                                        setParentListSelect={this.setParentListSelect}
                                    />
                                )
                            })
                        }
                        
                    </ScrollView>
                </View>
                
            </View>
        )
    }

}

export default ActivityList;

const styles = StyleSheet.create({
    body:{
        flex:3,
        //borderWidth:2
    },
    Header:{
        flex:1,
        alignSelf:'center',
        justifyContent:'center',
        fontSize:20,
        fontWeight:'bold',
        marginTop:'5%',
        marginBottom:'5%',
        minHeight:'10%',
        maxHeight:'10%'

    },
    HeadCenter:{
        fontSize:20,
        fontWeight:'bold'
    },
    TextCenter:{
        textAlign:'center'
    }
})