import React, {Component} from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage} from 'react-native';
import Activity from '../component/activity.js'

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
        
        if(this.props.TabData.type === "1"){
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

    render(){
        return(
            <View style={styles.body}>
                <ScrollView>
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
            </View>
        )
    }

}

export default ActivityList;

const styles = StyleSheet.create({
    body:{
        flex:3,
        //borderWidth:2
    }
})