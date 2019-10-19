import React,{ Component } from 'react';
import { View, Text, Button, StyleSheet, BackHandler, AsyncStorage,ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Header from '../component/header.js';
import ActivityList from '../component/activityList.js';
import BlockColumn from '../component/blockcolumn.js';
import AddActs from '../component/addActs.js';
import AddActsModal from '../component/addActModal.js';
import ModalSelectDate from '../component/modalSelectDate.js';
import AddTransModal from '../component/addTransModal.js';
import SettingTab from '../component/SettingTab.js';

class Main extends Component{
    constructor(props){
        super(props);

        this.setShowAddActModal = this.setShowAddActModal.bind(this);
        this.addActToList = this.addActToList.bind(this);
        this.setReRender = this.setReRender.bind(this);
        this.setIsContinue = this.setIsContinue.bind(this);
        this.setResetContinue = this.setResetContinue.bind(this);
        this.setSelectDateModal = this.setSelectDateModal.bind(this);
        this.setSelectDate = this.setSelectDate.bind(this);
        this.setTab = this.setTab.bind(this);
        this.setMainBackground = this.setMainBackground.bind(this);
        this.setParentList = this.setParentList.bind(this);
        this.setStateFromChild = this.setStateFromChild.bind(this);
    }

    state={
        ShowAddActModal:false,
        ShowAddTransModal:false,
        ShowSelectDateModal:false,
        reRender:false,
        isContinue:false,
        isResetContinue:false,
        selectDate:(new Date()),
        TabData:{
            TabName:'Daily Activity List'
        },
        TabDataDefault:{

        },
        token:'',
        MainBackground:null,
        parentList:'',
        parentListID:0
    }

    componentWillMount(){
        AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.setState({token:value});
            }else{
                Actions.signin();
            }
        });
        
        AsyncStorage.getItem('backgroundImg').then((value)=>{
            if(value){
                
                this.setState({MainBackground:value});
            }
        });
    }

    //Disabled Back Button
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }
    
    onBackButtonPressed() {
        return true;
    }

    setStateFromChild(stateName,state){
        eval('this.setState({'+stateName+':'+state+'});')
    }

    setShowAddActModal(isShow){
        this.setState({ShowAddActModal:isShow});
    }

    setSelectDateModal(isShow){
        this.setState({ShowSelectDateModal:isShow},()=>{
            this.setReRender(true);
        });
    }

    setMainBackground(img){
        this.setState({MainBackground:img});
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

    setResetContinue(state){
        this.setState({isResetContinue:state});
    }

    setTab(data){
        this.setState({TabData:data},()=>{
            this.setState({reRender:true});
        });
    }

    setParentList(parentName,parentID){
        /*console.log('Name >> ',parentName);
        console.log('ID >> ',parentID);*/
        this.setState({parentListID:parentID})
        this.setState({parentList:parentName});
    }

    addActToList(ID,amount){

        if(!amount){
            amount = 1;
        }

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
                "is_reset":this.state.isResetContinue,
                "date":(this.state.selectDate.getFullYear()+'-'+(this.state.selectDate.getMonth()+1)+'-'+this.state.selectDate.getDate()),
                "tabID":this.state.TabData.ID,
                "token":this.state.token,
                "parentList":this.state.parentListID,
                "amount":amount
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
            <ImageBackground source={{uri:this.state.MainBackground}} style={{width: '100%', height: '100%'}}>
                <View style={styles.bodyPage}>
                    <AddActsModal Show={this.state.ShowAddActModal}
                        addActToList = {this.addActToList}    
                        setShowAddActModal = {this.setShowAddActModal}
                        setIsContinue={this.setIsContinue}
                        setResetContinue={this.setResetContinue}
                        selectDate={this.state.selectDate}
                        setReRender={this.setReRender}
                        TabData={this.state.TabData}
                        parent={this.state.parentList}
                    />
                    <AddTransModal 
                        Show={this.state.ShowAddTransModal}
                        setStateFromChild={this.setStateFromChild}
                        addActToList={this.addActToList}
                        setReRender={this.setReRender}
                    />
                    <ModalSelectDate 
                        Show={this.state.ShowSelectDateModal}
                        setSelectDateModal={this.setSelectDateModal}
                        selectDate={this.state.selectDate}
                        setSelectDate={this.setSelectDate}
                        setReRender={this.setReRender}
                    />
                    <SettingTab 
                        setMainBackground = {this.setMainBackground}
                    />
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
                        setParentList={this.setParentList}
                    />
                    <BlockColumn size={0.5} />
                    <AddActs 
                        TabData={this.state.TabData}
                        setStateFromChild={this.setStateFromChild}
                        setParentList={this.setParentList}
                    />
                    <BlockColumn size={0.5} />
                    <Text>
                        {this.state.MainBackground}
                    </Text>
                </View>
            </ImageBackground>
        )
    }

}

export default Main;

const styles = StyleSheet.create({
    bodyPage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(255,255,255,0.8)'
    }
});