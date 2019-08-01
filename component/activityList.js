import React, {Component} from 'react';
import { View, Alert, StyleSheet, ScrollView} from 'react-native';
import Activity from '../component/activity.js'

class ActivityList extends Component{

    constructor(props){
        super(props);

        this.getActivityList = this.getActivityList.bind(this);
        this.props.setReRender = this.props.setReRender.bind(this)
        this.state={
            ActivityList:[]
        }
    }

    

    componentWillMount(){
        this.getActivityList();
    }

    componentWillUpdate(props){
        
        if(props.reRender){
            this.getActivityList();
            this.props.setReRender(false);
        }
    }

    getActivityList(){
        
        fetch('http://10.0.0.212/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"get_actList"
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            console.log('------------------- AAA ---------------');
            //console.log(response);
            this.setState({ActivityList:[]});
            this.setState({ActivityList:response});
            //console.log(res[0]);
        })

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
        borderWidth:2
    }
})