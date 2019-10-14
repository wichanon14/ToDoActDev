import React,{ Component } from 'react';
import { View, Text, AsyncStorage,TouchableOpacity, StyleSheet } from 'react-native';
import ModalTabSelect from '../component/modalTabSelect.js';

class Header extends Component{
    constructor(props){
        super(props);
        this.setShowModalTabSelect = this.setShowModalTabSelect.bind(this);
        this.setElementDate = this.setElementDate.bind(this);
        this.props.setTab = this.props.setTab.bind(this);
        this.props.setReRender = this.props.setReRender.bind(this);
    }

    state = {
        date:new Date(),
        showModalTabSelect:false,
        elementDate:<View></View>,
        token:''
    }

    setShowModalTabSelect(state){
        this.setState({showModalTabSelect:state});
    }

    setElementDate(type){
        if(type === "1"){
            this.setState({elementDate:(
                <TouchableOpacity 
                    onPress={()=>{
                        this.props.setSelectDateModal(true);
                    }}
                >
                    <Text>
                        {this.state.date.toDateString("MMMM yyyy")}
                        <Text
                            style={{color:'gray'}}
                        >
                            {"  (Daily Type)"}
                        </Text>
                    </Text>
                </TouchableOpacity>     
            )});
        }else if(type === "0"){
            this.setState({elementDate:(
                <Text>
                    {this.state.date.toDateString("MMMM yyyy")}
                    <Text
                        style={{color:'gray'}}
                    >
                        {"  (List Type)"}
                    </Text>
                </Text>
            )})
        }
    }

    componentWillUpdate(props){
        if(props.date != this.state.date){
            
            this.setState({date:props.date},()=>{
                this.setElementDate(props.Tab.type);
            });
            
        }
    }

    componentWillMount(){

        AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.setState({token:value},()=>{
                    this.getDefaultTab();
                });
            }else{
                Actions.signin();
            }
        });
    }

    getDefaultTab(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"getDefaultTabList",
                "token":this.state.token
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            //console.log(response);
            if(response){
                this.props.setTab(response);
                if(response.type === "1"){
                    this.setState({
                        elementDate:(
                            <TouchableOpacity 
                                onPress={()=>{
                                    this.props.setSelectDateModal(true);
                                }}
                            >
                                <Text>
                                    {this.state.date.toDateString("MMMM yyyy")} 
                                    <Text
                                        style={{color:'gray'}}
                                    >
                                        {"  (Daily Type)"}
                                    </Text>
                                </Text>
                            </TouchableOpacity>     
                        )
                    })
                }
            }
        })
    }

    render(){
        return(
            <View style={styles.Header}>
                <ModalTabSelect 
                    Show={this.state.showModalTabSelect}
                    setShowModalTabSelect={this.setShowModalTabSelect}
                    setTab={this.props.setTab}
                    setReRender={this.props.setReRender}
                    setElementDate={this.setElementDate}
                />
                <TouchableOpacity
                    onPress={()=>this.setState({showModalTabSelect:true})}
                >
                    <Text style={styles.HeadCenter}>
                        {this.props.Tab.TabName}
                    </Text>
                </TouchableOpacity>
                {this.state.elementDate} 
                           
            </View>
        );
    }

}

export default Header;

const styles = StyleSheet.create({
    Header:{
        flex:1,
        //borderWidth:2,
        alignSelf:'center',
        justifyContent:'center'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold'
    },
    TextCenter:{
        textAlign:'center'
    }
});