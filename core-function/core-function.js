import React,{ Component } from 'react';
import { AsyncStorage } from 'react-native';

class CoreFunction extends Component{

    constructor(props){
        super(props);

        this.setStateFromName = this.setStateFromName.bind(this);
        this.getStateFromName = this.getStateFromName.bind(this);
    }
    state={

    }

    async setStateFromName(stateName,state){
        await AsyncStorage.setItem(stateName,state);
    }

    async getStateFromName(stateName){

        ret = await AsyncStorage.getItem(stateName);
        return ret;
        
    }

    CreateList(ID,is_continue,isResetContinue,date,TabID,token,parentListID,amount){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_actList",
                "ID":ID,
                "is_continue":is_continue,
                "is_reset":isResetContinue,
                "date":date,
                "tabID":TabID,
                "token":token,
                "parentList":parentListID,
                "amount":amount
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            console.log(response);
        })

    }

    async CreateActivity(ActivityName){
        a = await fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_act",
                "act_name":ActivityName
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            return response['ID'];
        })

        return a;
    }
    
}

export default CoreFunction;
