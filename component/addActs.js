import React,{ Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class AddActs extends Component{

    state = {
        txt:"Add Activities",
        type:0
    }

    componentWillMount(){
        this.setState({txt:this.txtAdd()});
        this.setState({type:this.props.TabData.type})
    }

    componentWillUpdate(props){
        if(props.TabData.type != this.state.type){
            this.setState({txt:this.txtAdd()});
            this.setState({type:this.props.TabData.type})
        }
    }

    txtAdd(){
        switch(parseInt(this.props.TabData.type)){
            case 0: return 'Add Activities';
            case 1: return 'Add Activities';
            case 4: return 'Add Transactions';
            default:break;
        }

    }

    render(){
        return(
            <TouchableOpacity 
                onPress={
                    ()=>{
                        switch(parseInt(this.props.TabData.type)){
                            case 0: this.props.setStateFromChild('ShowAddActModal',true); break;
                            case 1: this.props.setStateFromChild('ShowAddActModal',true); break;
                            case 4: this.props.setStateFromChild('ShowAddTransModal',true); break;
                            default:break;
                        }
                        this.props.setParentList('',0,this.props.TabData.type);
                    }
                }
            >
                <View style={styles.main}>
                    <Text style={styles.txt}>
                        {
                            this.txtAdd()
                        }    
                    </Text>
                </View>
            </TouchableOpacity>            
        );
    }

}

export default AddActs;

const styles = StyleSheet.create({
    main:{
        minWidth:'75%',
        flexDirection:'row',
        height:50,
        borderWidth:2
    },
    txt:{
        flex:1,
        textAlign:'center',
        alignSelf:'center',
        //marginTop:'3%'
    }
});