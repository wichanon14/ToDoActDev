import React,{ Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class AddActs extends Component{

    render(){
        return(
            <TouchableOpacity 
                onPress={
                    ()=>{
                        console.log(this.props.TabData);
                        switch(parseInt(this.props.TabData.type)){
                            case 1: this.props.setStateFromChild('ShowAddActModal',true); break;
                            case 2: this.props.setStateFromChild('ShowAddActModal',true); break;
                            case 3: this.props.setStateFromChild('ShowAddActModal',true); break;
                            case 4: this.props.setStateFromChild('ShowAddTransModal',true); break;
                            default:break;
                        }
                        this.props.setParentList('',0);
                    }
                }
            >
                <View style={styles.main}>
                    <Text style={styles.txt}>
                        {
                            (parseInt(this.props.TabData.type) === 1)?
                            'Add Activities':
                            'Add Transactions'
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