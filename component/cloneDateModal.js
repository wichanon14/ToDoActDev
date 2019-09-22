import React,{ Component } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, 
    Image, ScrollView, AsyncStorage } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import arrowUp from '../assets/arrow-up.jpg';
import arrowDown from '../assets/arrow-down.jpg';

class CloneDateModal extends Component{

    state={
        Show:false,
        date:0,
        month:0,
        year:0,
        monthName:'',
        retrieveDate:new Date(),
        ActivityList:[],
        token:''
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
        if(props.Show != this.state.Show){
            this.setState({Show:props.Show},()=>{
                this.getDateToShow();
            });
        }
    }

    getMaxDate(month,year){
        //console.log('month >> ',this.state.month);
        if(month=== 0 || month=== 2 || month=== 4 || month=== 6 || month=== 7 || month=== 9 
            || month=== 11 ){
            return 31;
        }
        if(month=== 3 || month=== 5 || month=== 8 || month=== 10 ){
            return 30;
        }
        if(month === 1){
            var d = new Date(year+'-02-29');
            if(d.getDate()===29){
                return 29;
            }else{
                return 28;
            }
        }
    }

    changeDate(action,type){

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        if(action==='up'){
            switch(type){
                case 'year': this.setState({year:this.state.year+1});
                             break;
                case 'month': (this.state.month<11)?this.setState({month:this.state.month+1},()=>
                            {
                                this.setState({monthName:monthNames[this.state.month]});
                                if(this.getMaxDate(this.state.month,this.state.year)<this.state.date){
                                    this.setState({date:this.getMaxDate(this.state.month,this.state.year)},()=>this.getActList())
                                }
                            }):this.setState({month:0},()=>{
                                this.setState({monthName:monthNames[this.state.month]});
                                if(this.getMaxDate(this.state.month,this.state.year)<this.state.date){
                                    this.setState({date:this.getMaxDate(this.state.month,this.state.year)},()=>this.getActList())
                                }
                            });
                             break;
                case 'date': 
                             var maxDate = this.getMaxDate(this.state.month,this.state.year);
                             //console.log(maxDate);
                             if(this.state.date<this.getMaxDate(this.state.month,this.state.year)){
                                this.setState({date:this.state.date+1},()=>this.getActList());
                             }else{
                                this.setState({date:1},()=>this.getActList());
                             }
                            break;
            }
        }else{
            if(action==='down'){
                switch(type){
                    case 'year': this.setState({year:this.state.year-1},()=>this.getActList());
                                 break;
                    case 'month': (this.state.month>0)?this.setState({month:this.state.month-1},()=>
                                {
                                    this.setState({monthName:monthNames[this.state.month]})
                                    if(this.getMaxDate(this.state.month,this.state.year)<this.state.date){
                                        this.setState({date:this.getMaxDate(this.state.month,this.state.year)},()=>this.getActList())
                                    }
                                }):this.setState({month:11},()=>
                                {
                                    this.setState({monthName:monthNames[this.state.month]})
                                    if(this.getMaxDate(this.state.month,this.state.year)<this.state.date){
                                        this.setState({date:this.getMaxDate(this.state.month,this.state.year)},()=>this.getActList())
                                    }
                                });
                                break;
                    case 'date': 
                                var maxDate = this.getMaxDate(this.state.month,this.state.year);
                                //console.log(maxDate);
                                if(this.state.date>1){
                                    this.setState({date:this.state.date-1},()=>this.getActList());
                                }else{
                                    this.setState({date:maxDate},()=>this.getActList());
                                }
                                 break;
                }
            }
        }

        //console.log('> ',this.state.date,'/',this.state.month,'/',this.state.year);
        
    }

    getDateToShow(){
        var dd = this.state.retrieveDate;
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.setState({date:dd.getDate()});
        this.setState({month:dd.getMonth()});
        this.setState({monthName:monthNames[dd.getMonth()]});
        this.setState({year:dd.getFullYear()});
        //console.log('> ',this.state.date,'/',this.state.month,'/',this.state.year);

        var dateString = dd.getFullYear()+'-'+(dd.getMonth()+1)+'-'+dd.getDate();
        this.getActivityList(dateString);
    }

    getActivityList(date){
        
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"get_actList",
                "token":this.state.token,
                "date":date,
                "tabID":this.props.TabData.ID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.setState({ActivityList:[]});
            this.setState({ActivityList:response});
        })

    }

    cloneActivity(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"cloneList",
                "token":this.state.token,
                "CloneDate":this.state.year+'-'+(this.state.month+1)+'-'+this.state.date,
                "SetDate":this.props.selectDate.getFullYear()+'-'+(this.props.selectDate.getMonth()+1)+'-'+this.props.selectDate.getDate(),
                "tabID":this.props.TabData.ID
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.setState({Show:!this.state.Show},()=>{
                this.props.setShowParentCloneModal(false);
                this.props.setShowAddActModal(false);
                this.props.setShowAddActModalChild(false);
                this.props.setReRender(true);
            })
        })
    }

    getActList(){
        var year = this.state.year;
        var month = this.state.month+1;
        var date = this.state.date;
        var dateString = year+'-'+month+'-'+date;
        this.getActivityList(dateString);
        
    }

    onSelectDate(){
        //console.log('> ',this.state.date,'/',this.state.month,'/',this.state.year);
        var monthString = (this.state.month+1>10)?this.state.month+1:'0'+(this.state.month+1);
        var dateString = (this.state.date>9)?this.state.date:'0'+(this.state.date);
        var dateString = this.state.year+'-'+monthString+'-'+dateString;
        var d = new Date(dateString);
        //console.log('select dateString >> ',d);
        this.props.setSelectDate(d);
        this.setState({Show:!this.state.Show},()=>{
            this.props.setSelectDateModal(this.state.Show);
        })
    }

    render(){
        return(
        <Modal
            isVisible={this.state.Show}
            animationInTiming={10}
            animationOutTiming={500}
            backdropTransitionOutTiming = {10}
        >
            <View style={styles.body}>
                    <BlockColumn size={0.2}/>
                    <View>
                        <Text style={styles.HeadCenter}>
                            Select Clone Date
                        </Text>
                    </View>
                    <BlockColumn size={0.1}/>
                    
                    <View 
                        style={{
                            alignSelf:'center',justifyContent:'center'
                        }}
                    >
                        
                        <View style={{flexDirection:'row'}}>

                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text>Date</Text>
                                <TouchableOpacity onPress={()=>this.changeDate('up','date')}>
                                    <Image source={arrowUp} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                                <Text style={styles.DateSelect}>
                                    {(this.state.date>9)?this.state.date:'0'+this.state.date}
                                </Text>
                                <TouchableOpacity onPress={()=>this.changeDate('down','date')}>
                                    <Image source={arrowDown} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                            </View>

                            <View style={{paddingLeft:20,paddingRight:20,
                                alignItems:'center',justifyContent:'center'}}>
                                <Text>Month</Text>
                                <TouchableOpacity onPress={()=>this.changeDate('up','month')}>
                                    <Image source={arrowUp} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                                <Text style={styles.DateSelectMonth}>
                                    {this.state.monthName}
                                </Text>
                                <TouchableOpacity onPress={()=>this.changeDate('down','month')}>
                                    <Image source={arrowDown} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                            </View>

                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text>Year</Text>
                                <TouchableOpacity onPress={()=>this.changeDate('up','year')}>
                                    <Image source={arrowUp} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                                <Text style={styles.DateSelect}>{this.state.year}</Text>
                                <TouchableOpacity onPress={()=>this.changeDate('down','year')}>
                                    <Image source={arrowDown} style={{width:60,height:32}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <BlockColumn size={0.2}/>
                    <ScrollView contentContainerStyle={{alignItems:'center'}}>
                        {   
                            this.state.ActivityList.map((data,key)=>{
                                return(
                                    <Text key={key}>{data.activity_name}</Text>
                                )
                            })
                        }
                    </ScrollView>
                    <View style={styles.BodyButton}>
                        <Button 
                            onPress={()=>{
                                
                                this.cloneActivity();
                            }}
                            title="Clone"
                        />
                        <BlockColumn size={0.2}/>
                        <Button 
                            onPress={()=>{
                                this.setState({Show:!this.state.Show},()=>{
                                    this.props.setShowParentCloneModal(false);
                                })
                            }}
                            title="Close"
                        />
                    </View>
                    <BlockColumn size={0.2}/>
                </View>
        </Modal>
        )
    }

}

export default CloneDateModal;


const styles = StyleSheet.create({

    body:{
        flex:1,
        minHeight:100,
        backgroundColor:'white'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold',
        alignSelf:'center',
        justifyContent:'center'
    },
    BodyButton:{
        flexDirection:'row',
        alignSelf:'center',
        justifyContent:'center'
    },
    Icon:{
        fontSize: 30
    },
    DateSelect:{
        fontSize:30,
        //paddingTop:5,
        paddingBottom:10
    },
    DateSelectMonth:{
        fontSize:30,
        paddingBottom:10
    }

});