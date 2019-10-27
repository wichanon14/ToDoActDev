import React, {Component} from 'react';
import { Alert, View, StyleSheet, AsyncStorage, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import showPopupMenu from 'react-native-popup-menu-android'


class Activity extends Component{

    state={
        isCheck : false,
        token: '',
        parentList:0,
        showHideSubList:false
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

        if(this.props.check==="0"){
            this.setState({isCheck:false});
        }else{
            this.setState({isCheck:true});
        }
    }

    componentWillUpdate(props){
        if(props.parentList!=this.state.parentList){
            this.setState({parentList:props.parentList});
        }
    }

    selectList(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"select_list",
                "ID":this.props.id,
                "token":this.state.token
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            
            this.props.setReRender(true);
            
        })
    }

    deleteList(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"delete_list",
                "token":this.state.token,
                "ID":this.props.id
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            this.props.setReRender(true);
            
        })
    }

    ConfirmDelete(){
        Alert.alert(
            'Confirm Delete ',
            'Are you sure for delete '+this.props.label,
            [
                {text:'Yes',onPress:()=>this.deleteList()},
                {text:'No',onPress:()=>console.log('No')}
            ],
            {cancelable: true}
        )
    }

    moreButton = null;
    refMoreButton = el => this.moreButton = el;

    showMore = () => {
        if(this.state.parentList==0){
            showPopupMenu(
                [
                  { id:1, label:'Add SubList' },
                  { id:2, label:'Delete' }
                ],
                this.handleMoreItemSelect,
                this.moreButton
              );
        }else{
            showPopupMenu(
                [
                  { id:2, label:'Delete' }
                ],
                this.handleMoreItemSelect,
                this.moreButton
              );
        }
        
    }

    handleMoreItemSelect = (item) => {
        switch(item.id){
            case 0: this.selectList(); break;
            case 1: this.props.setParentList(this.props.label,this.props.id); break;
            case 2: this.ConfirmDelete(); break;
            default: break;
        }
    }

    showHiddenSubList(){
        if(this.props.setShowHiddenList==0){
            this.props.setParentListSelect(this.props.id);
        }else{
            this.props.setParentListSelect(0);
        }
        
    }

    render(){
        const styles = StyleSheet.create({
            body:{
                flexDirection:'row',
                height:(this.props.parentList!=0)?((this.props.label.length>30)?60:40):40,
                minWidth:'70%',
                display:
                (this.props.parentList==0)?'flex':
                ((this.props.parentList==this.props.setShowHiddenList)?'flex':'none')
            }
        })
        return(
            <View style={styles.body} >
                <CheckBox
                ref={this.refMoreButton}
                title={this.props.label}
                checked={this.state.isCheck}
                onPress={()=>{
                    this.selectList();
                }}
                onLongPress={()=>{
                    this.showMore();
                }}
                containerStyle = {{minWidth:'10%',maxWidth:'70%',
                backgroundColor:'transparent',borderWidth:0,flexWrap: 'wrap',
                paddingLeft:(this.props.parentList!=0)?'10%':'3%'}}
                />
                {
                    (this.props.amountSubList!=0 && this.props.parentList==0)?(
                        <TouchableOpacity onPress={()=>{
                            this.showHiddenSubList();
                        }} style={{marginTop:'4%',minWidth:'10%',maxWidth:'10%',
                        backgroundColor:'black',borderRadius:50}}>
                            <Text style={{textAlign:'center',paddingTop:'15%',color:'white'}}>
                            {this.props.amountSubList}    
                            </Text>               
                        </TouchableOpacity>
                                
                    ):(
                        <View></View>
                    )
                }
            </View>
        )
    }

}

export default Activity;

