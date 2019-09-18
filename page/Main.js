import React,{ Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from '../component/header.js';
import ActivityList from '../component/activityList.js';
import BlockColumn from '../component/blockcolumn.js';
import AddActs from '../component/addActs.js';
import AddActsModal from '../component/addActModal.js';
import ModalSelectDate from '../component/modalSelectDate.js';

class Main extends Component{
    constructor(props){
        super(props);

        this.setShowAddActModal = this.setShowAddActModal.bind(this);
        this.addActToList = this.addActToList.bind(this);
        this.setReRender = this.setReRender.bind(this);
        this.setIsContinue = this.setIsContinue.bind(this);
        this.setSelectDateModal = this.setSelectDateModal.bind(this);
        this.setSelectDate = this.setSelectDate.bind(this);
        this.setTab = this.setTab.bind(this);
    }

    state={
        ShowAddActModal:false,
        ShowSelectDateModal:false,
        reRender:false,
        isContinue:false,
        selectDate:(new Date()),
        TabData:{
            TabName:'Daily Activity List'
        },
        TabDataDefault:{

        }
    }

    setShowAddActModal(isShow){
        this.setState({ShowAddActModal:isShow});
    }

    setSelectDateModal(isShow){
        this.setState({ShowSelectDateModal:isShow},()=>{
            this.setReRender(true);
        });
    }

    setReRender(state){
        this.setState({reRender:state});
    }

    setSelectDate(date){
        this.setState({selectDate:date});
    }

    setIsContinue(state){
        this.setState({isContinue:state});
    }

    setTab(data){
        //console.log('dataTab >> ',data);
        this.setState({TabData:data},()=>{
            this.setState({reRender:true});
        });
    }

    addActToList(ID){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"insert_actList",
                "ID":ID,
                "is_continue":this.state.isContinue,
                "date":(this.state.selectDate.getFullYear()+'-'+(this.state.selectDate.getMonth()+1)+'-'+this.state.selectDate.getDate()),
                "tabID":this.state.TabData.ID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            //console.log(response);
            this.setState({reRender:true});
            this.setIsContinue(false);
        })
    }

    render(){
        return(
            <View style={styles.bodyPage}>
                <AddActsModal Show={this.state.ShowAddActModal}
                    addActToList = {this.addActToList}    
                    setShowAddActModal = {this.setShowAddActModal}
                    setIsContinue={this.setIsContinue}
                    selectDate={this.state.selectDate}
                    setReRender={this.setReRender}
                    TabData={this.state.TabData}
                />
                <ModalSelectDate 
                    Show={this.state.ShowSelectDateModal}
                    setSelectDateModal={this.setSelectDateModal}
                    selectDate={this.state.selectDate}
                    setSelectDate={this.setSelectDate}
                    setReRender={this.setReRender}
                />
                <BlockColumn size={0.5} />
                <Header 
                    setSelectDateModal={this.setSelectDateModal}
                    date={this.state.selectDate}
                    Tab={this.state.TabData}
                    setTab={this.setTab}
                    setReRender={this.setReRender}
                />
                <ActivityList 
                    reRender={this.state.reRender}
                    setReRender={this.setReRender}
                    date={this.state.selectDate}
                    TabData={this.state.TabData}
                />
                <BlockColumn size={0.5} />
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