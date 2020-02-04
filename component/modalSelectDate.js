import React, { Component } from 'react';
import { View, Text, StyleSheet,Button,TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import BlockColumn from '../component/blockcolumn.js';
import arrowUp from '../assets/arrow-up.jpg';
import arrowDown from '../assets/arrow-down.jpg';

class ModalSelectDate extends Component{

    state={
        Show:false,
        date:0,
        month:0,
        year:0,
        retrieveDate:(new Date()),
        monthName:''
    }

    componentWillUpdate(props){
        //console.log('>> ',props);
        if(props.Show != this.state.Show){
            this.setState({Show:props.Show});
            this.setState({retrieveDate:props.selectDate},()=>{
                this.getDateToShow();
            })
        }
    }

    getMaxDate(){
        //console.log('month >> ',this.state.month);
        if(this.state.month=== 0 || this.state.month=== 2 || this.state.month=== 4 
            || this.state.month=== 6 || this.state.month=== 7 || this.state.month=== 9 
            || this.state.month=== 11 ){
            return 31;
        }
        if(this.state.month=== 3 || this.state.month=== 5 || this.state.month=== 8 
            || this.state.month=== 10 ){
            return 30;
        }
        if(this.state.month === 1){
            var d = new Date(this.state.year+'-02-29');
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
                                if(this.getMaxDate()<this.state.date){
                                    this.setState({date:this.getMaxDate()})
                                }
                            }):this.setState({month:0},()=>{
                                this.setState({monthName:monthNames[this.state.month]});
                                if(this.getMaxDate()<this.state.date){
                                    this.setState({date:this.getMaxDate()})
                                }
                            });
                             break;
                case 'date': 
                             var maxDate = this.getMaxDate();
                             //console.log(maxDate);
                             if(this.state.date<this.getMaxDate()){
                                this.setState({date:this.state.date+1});
                             }else{
                                this.setState({date:1});
                             }
                            break;
            }
        }else{
            if(action==='down'){
                switch(type){
                    case 'year': this.setState({year:this.state.year-1});
                                 break;
                    case 'month': (this.state.month>0)?this.setState({month:this.state.month-1},()=>
                                {
                                    this.setState({monthName:monthNames[this.state.month]})
                                    if(this.getMaxDate()<this.state.date){
                                        this.setState({date:this.getMaxDate()})
                                    }
                                }):this.setState({month:11},()=>
                                {
                                    this.setState({monthName:monthNames[this.state.month]})
                                    if(this.getMaxDate()<this.state.date){
                                        this.setState({date:this.getMaxDate()})
                                    }
                                });
                                break;
                    case 'date': 
                                var maxDate = this.getMaxDate();
                                //console.log(maxDate);
                                if(this.state.date>1){
                                    this.setState({date:this.state.date-1});
                                }else{
                                    this.setState({date:maxDate});
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
    }

    onSelectDate(){
        //console.log('> ',this.state.date,'/',this.state.month,'/',this.state.year);
        var monthString = (this.state.month+1>9)?this.state.month+1:'0'+(this.state.month+1);
        var dateString = (this.state.date>9)?this.state.date:'0'+(this.state.date);
        var dateString = this.state.year+'-'+monthString+'-'+dateString;
        //console.log('select dateString >> ',dateString);
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
                backdropTransitionOutTiming = {100}
            >
                <View style={styles.body}>
                    <BlockColumn size={0.2}/>
                    <View>
                        <Text style={styles.HeadCenter}>
                            Select Date
                        </Text>
                    </View>
                    <BlockColumn size={0.2}/>
                    
                    <View 
                        style={{
                            alignSelf:'center',justifyContent:'center'
                        }}
                    >
                        
                        <View style={{flexDirection:'row'}}>

                            {
                                (this.props.showOnly==='Date'||this.props.showAll)?
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
                                </View>:
                                <View></View>
                            }
                            
                            {
                                (this.props.showOnly==='Month'||this.props.showAll)?
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
                                </View>:
                                <View></View>
                            }

                            {(this.props.showOnly==='Year'||this.props.showAll)?
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <Text>Year</Text>
                                    <TouchableOpacity onPress={()=>this.changeDate('up','year')}>
                                        <Image source={arrowUp} style={{width:60,height:32}}/>
                                    </TouchableOpacity>
                                    <Text style={styles.DateSelect}>{this.state.year}</Text>
                                    <TouchableOpacity onPress={()=>this.changeDate('down','year')}>
                                        <Image source={arrowDown} style={{width:60,height:32}}/>
                                    </TouchableOpacity>
                                </View>:
                                <View></View>
                            }
                            
                        </View>
                    </View>

                    <BlockColumn size={0.2}/>
                    
                    <View style={styles.BodyButton}>
                        <Button 
                            onPress={()=>{
                                this.onSelectDate();
                                
                            }}
                            title="Select"
                        />
                        <BlockColumn size={0.2}/>
                        <Button 
                            onPress={()=>{
                                this.setState({Show:!this.state.Show},()=>{
                                    this.props.setSelectDateModal(this.state.Show);
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

export default ModalSelectDate;

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