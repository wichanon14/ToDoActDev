import React,{ Component } from 'react';
import {View, Text, StyleSheet, Button, AsyncStorage, ScrollView, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../blockcolumn.js';
import ModalSelectDate from '../modalSelectDate.js';
import { Actions } from 'react-native-router-flux';
import BlockReport from '../blockdisplay/blockReport.js';

class ReportModal extends Component{
    constructor(props){
        super(props)
        this.setSelectDate = this.setSelectDate.bind(this);
        this.setSelectDateModal = this.setSelectDateModal.bind(this);
        this.setReRender = this.setReRender.bind(this);
    }

    state={
        date:new Date(), 
        ShowSelectDateModal:false,
        selectDate:new Date(),
        reRender:false,
        reportList:[],
        token:'',
        detail:false
    }

    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", 
        "September", "October", "November", "December"];

    componentWillReceiveProps(nextProps){
        //call getReportDate()
        if(this.props.TabID){
            this.getReportDate();
            this.getReport();
        }
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


    setSelectDate(date){
        this.setState({selectDate:date.getDate()});
        this.setState({date:date.getDate()},()=>{
            // call updateDateForGetReport(date.getDate())
            this.updateDateForGetReport();
        });
        
        
    }

    setSelectDateModal(isShow){
        this.setState({ShowSelectDateModal:isShow},()=>{
            this.setReRender(true);
        });
    }

    setReRender(state){
        this.setState({reRender:state});
        // call getReport() api
        this.getReport();
    }

    getReportDate(){
        // get token 
        // set state with loading report date
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"getReportDate",
                "token":this.state.token,
                "tabID":this.props.TabID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            if(response.msg_code){
                this.setState({date:response.report_date});
                this.setState({selectDate:new Date(2020,2,parseInt(response.report_date))});
            }
        })

    }

    updateDateForGetReport(){
        // get token and new report date
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"updateDateForReport",
                "token":this.state.token,
                "report_date":""+this.state.date,
                "tabID":this.props.TabID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            //console.log(response);
        })
    }

    getReport(){
        // get token and tabID
        // map return to report list
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"getReport",
                "token":this.state.token,
                "tabID":this.props.TabID,
                "detail":(this.state.detail)?1:0
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            this.setState({reportList:[]});
            if(response.length){
                this.setState({reportList:response});
            }
            
        })
    }

    render(){
        return(
            <Modal
                isVisible={this.props.show}
                animationInTiming={300}
                animationOutTiming={500}
                backdropTransitionOutTiming={100}
                style={{
                    justifyContent:'center',
                    alignItems:'center'
                }}
                animationType="fade"
                hasBackdrop={true}
            >
                <ModalSelectDate 
                    Show={this.state.ShowSelectDateModal}
                    setSelectDateModal={this.setSelectDateModal}
                    selectDate={this.state.selectDate}
                    setSelectDate={this.setSelectDate}
                    setReRender={this.setReRender}
                    showOnly='Date'
                />
                <View style={{backgroundColor:'white',height:'80%',width:'90%'}}>
                    <BlockColumn size={0.2} />
                    <View>
                        <Text style={styles.HeadCenter} /* Summary Titile */> 
                            Summary List
                        </Text>
                        <BlockColumn size={0.08} />
                        <TouchableOpacity 
                            onPress={()=>{
                                this.setState({ShowSelectDateModal:true});
                            }}
                        >
                            <Text style={styles.UnderHeadCenter}>
                                {(typeof(this.state.date)===Object)?this.state.date.getDate():this.state.date+" Every Month"}
                            </Text>
                        </TouchableOpacity>   
                    </View>                      
                    <BlockColumn size={0.2} />
                    <View style={{width:'30%',marginLeft:'10%',
                        display:(parseInt(this.props.TabID)===17?'flex':'none')}}>
                        <TouchableOpacity
                            onPress={
                                ()=>this.setState({detail:!this.state.detail},
                                    ()=>{
                                        this.getReport();
                                    })
                            }
                        >
                            <View style={{backgroundColor:'black',alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'white'}}>
                                    {(this.state.detail)?'Overview View':'Detail View'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <BlockColumn size={0.2} />
                    <ScrollView style={{maxHeight:'60%',borderTopWidth:1}}>
                            {
                                this.state.reportList.map((data,key)=>{
                                    return (
                                        <BlockReport 
                                            label={data.activity_name}
                                            value={data.activity_freq}
                                            key={key}
                                        />
                                    )
                                })
                            }
                    </ScrollView>
                    <BlockColumn size={0.5} />
                    <Button //close button
                        onPress={()=>{
                            this.props.setParentState('ShowReportModal',false);
                        }}
                        title={"Close"}
                    />
                </View>
            </Modal>
        )
    }

}

export default ReportModal;

const styles = StyleSheet.create({
    bodyModal:{
        //flex:1,
        minHeight:'100%',
        backgroundColor:'white'
    },
    HeadCenter:{
        fontSize:25,
        fontWeight:'bold',
        alignSelf:'center',
        justifyContent:'center',
        top:'7%'
    },
    UnderHeadCenter:{
        fontSize:15,
        alignSelf:'center',
        justifyContent:'center',
        top:'7%'
    },
    bodyModalDate:{
        minHeight:'50%',
        backgroundColor:'white'
    }
})