import React,{ Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from '../component/header.js';
import ActivityList from '../component/activityList.js';
import BlockColumn from '../component/blockcolumn.js';
import AddActs from '../component/addActs.js';
import AddActsModal from '../component/addActModal.js';

class Main extends Component{
    constructor(props){
        super(props);

        this.setShowAddActModal = this.setShowAddActModal.bind(this);
        this.addActToList = this.addActToList.bind(this);
        this.setReRender = this.setReRender.bind(this);
    }

    state={
        ShowAddActModal:false,
        reRender:false
    }

    setShowAddActModal(isShow){
        this.setState({ShowAddActModal:isShow});
    }

    setReRender(state){
        this.setState({reRender:state});
    }

    addActToList(ID){
        fetch('http://10.0.0.212/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_actList",
	            "ID":ID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            //console.log(response);
            this.setState({reRender:true});
        })
    }

    render(){
        return(
            <View style={styles.bodyPage}>
                <AddActsModal Show={this.state.ShowAddActModal}
                    addActToList = {this.addActToList}    
                    setShowAddActModal = {this.setShowAddActModal}
                />
                <BlockColumn size={0.5} />
                <Header />
                <ActivityList 
                    reRender={this.state.reRender}
                    setReRender={this.setReRender}
                />
                <AddActs 
                    setShowAddActModal={this.setShowAddActModal}
                />
                <BlockColumn size={0.5} />
            </View>
        )
    }

}

export default Main;

const styles = StyleSheet.create({
    bodyPage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        //backgroundColor:'red',
    }
});