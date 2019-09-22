import React,{ Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import BlockColumn from '../component/blockcolumn.js';
import { Actions } from 'react-native-router-flux';

class Signin extends Component{

    state={
        username:'',
        password:[0,0,0,0,0,0],
        elementForm:<View></View>,
        token:''
    }

    goToMain = () => {
        Actions.main();
     }

    componentDidMount(){

        token = AsyncStorage.getItem('token').then((value)=>{
            if(value){
                this.goToMain();
            }
            
        });
        username = AsyncStorage.getItem('email').then((value)=>{
            this.setState({username:value},()=>{
                this.setState({
                    elementForm:
                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <TextInput 
                            placeholder="USERNAME"
                            maxLength={40}
                            style={{borderWidth:1,width:'80%',padding:10}}
                            onChangeText={(txt)=>{
                                console.log('txt >> ',txt,' length >> ',txt.replace(/^A-Za-z0-9.@_/,"").length);
                                this.setState({username:(txt.replace(/^A-Za-z0-9.@_/,""))});
                            }}
                            defaultValue={this.state.username}
                        />
                        <BlockColumn size={0.3} />
                        <TouchableOpacity
                            onPress={()=>this.checkEmail()}
                            style={{width:'100%',
                            justifyContent:'center',
                            alignItems:'center'}}
                        >
                            <View style={{
                                width:'80%',
                                minHeight:'22%',
                                borderWidth:1,
                                justifyContent:'center',
                                alignItems:'center',
                                backgroundColor:'black'
                            }}>
                                <Text style={{fontSize:15,color:'white'}}>
                                    Next
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                })
            })
        
        })
    }

    backForEmail(){
        this.setState({
            elementForm:
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                <TextInput 
                    placeholder="USERNAME"
                    maxLength={40}
                    style={{borderWidth:1,width:'80%',padding:10}}
                    onChangeText={(txt)=>{
                        this.setState({username:(txt.replace(/^A-Za-z0-9.@_/,""))});
                    }}
                    defaultValue={this.state.username}
                />
                <BlockColumn size={0.3} />
                <TouchableOpacity
                    onPress={()=>this.checkEmail()}
                    style={{width:'100%',
                    justifyContent:'center',
                    alignItems:'center'}}
                >
                    <View style={{
                        width:'80%',
                        minHeight:'22%',
                        borderWidth:1,
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:'black'
                    }}>
                        <Text style={{fontSize:15,color:'white'}}>
                            Next
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        })
    }

    nextForPassword(){
        this.setState({
            elementForm:
            <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                <View style={{flexDirection:'row'}}>
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_1 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[0]=txt;
                            this.setState({password:password});
                            if (txt) this.input_2.focus();
                        }}
                        onFocus={()=>{
                            this.input_1.clear()
                        }}
                    />
                    <BlockColumn size={0.1} />
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_2 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[1]=txt;
                            this.setState({password:password});
                            if (txt) this.input_3.focus();
                        }}
                        onFocus={()=>{
                            this.input_2.clear()
                        }}
                    />
                    <BlockColumn size={0.1} />
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_3 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[2]=txt;
                            this.setState({password:password});
                            if (txt) this.input_4.focus();
                        }}
                        onFocus={()=>{
                            this.input_3.clear()
                        }}
                    />                
                    <BlockColumn size={0.1} />
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_4 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[3]=txt;
                            this.setState({password:password});
                            if (txt) this.input_5.focus();
                        }}
                        onFocus={()=>{
                            this.input_4.clear()
                        }}
                    />                
                    <BlockColumn size={0.1} />
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_5 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[4]=txt;
                            this.setState({password:password});
                            if (txt) this.input_6.focus();
                        }}
                        onFocus={()=>{
                            this.input_5.clear()
                        }}
                    />                
                    <BlockColumn size={0.1} />
                    <TextInput 
                        keyboardType={'phone-pad'}
                        ref={(ref) => { 
                            this.input_6 = ref; 
                        }}
                        placeholder="_"
                        maxLength={1}
                        style={{borderWidth:1,width:'10%',padding:10}}
                        onChangeText={(txt)=>{
                            let password = this.state.password;
                            password[5]=txt;
                            this.setState({password:password},()=>{
                                this.SignIn();
                            });
                        }}
                        onFocus={()=>{
                            this.input_6.clear()
                        }}
                    />                
                    <BlockColumn size={0.1} />    
                </View>
                <BlockColumn size={0.3} />
                <TouchableOpacity
                    onPress={()=>this.SignIn()}
                    style={{width:'100%',
                    justifyContent:'center',
                    alignItems:'center'}}
                >
                    <View style={{
                        width:'80%',
                        minHeight:'15%',
                        borderWidth:1,
                        justifyContent:'center',
                        alignItems:'center',
                        backgroundColor:'black'
                    }}>
                        <Text style={{fontSize:15,color:'white'}}>
                            Sign in
                        </Text>
                    </View>
                </TouchableOpacity>
                <BlockColumn size={0.1} />
                <TouchableOpacity
                    onPress={()=>this.backForEmail()}
                    style={{width:'100%',
                    justifyContent:'center',
                    alignItems:'center'}}
                >
                    <View style={{
                        width:'80%',
                        minHeight:'15%',
                        borderWidth:1,
                        justifyContent:'center',
                        alignItems:'center',
                    }}>
                        <Text style={{fontSize:15}}>
                            Back
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        })
    }

    SignIn(){
        fetch('http://165.22.242.255/toDoActService/action.php',{
            method:'POST',
            cache: 'no-cache',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "action":"signin",
                "email":this.state.username,
                "accessKey":this.EncryptAccessKey()
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(response=>{
            if(response){
                if(response.token){
                    AsyncStorage.setItem('email',this.state.username);
                    AsyncStorage.setItem('token',response.token);
                    this.goToMain();
                    
                }else{
                    Alert.alert(
                        'Sign in fail',
                        'Your identify key is wrong',
                        [
                            {text:'OK',onPress:()=>console.log("OK")}
                        ]
                    );
                }
            }
        })
    }

    checkEmail(){
        
        if(this.state.username){
            fetch('http://165.22.242.255/toDoActService/action.php',{
                method:'POST',
                cache: 'no-cache',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "action":"checkEmail",
                    "email":this.state.username.trim()
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(response=>{
                if(response){
                    if(response.msg){
                        this.nextForPassword();
                    }else{
                        Alert.alert(
                            'Email not found',
                            'Email do not exits!',
                            [
                                {text:'OK',onPress:()=>console.log("OK")}
                            ]
                        );
                    }
                }else{
                    Alert.alert(
                        'Email not found',
                        'Email do not exits!',
                        [
                            {text:'OK',onPress:()=>console.log("OK")}
                        ]
                    );
                }
            })
        }else{
            Alert.alert(
                'Email Error',
                'Please fill email',
                [
                    {text:'OK',onPress:()=>console.log("OK")}
                ]
            );
        }
        
    }

    EncryptAccessKey(){
        let accessKey = "$$";

        let pwd = this.state.password;
        for(var i=0;i<pwd.length;i++){
            accessKey += String.fromCharCode(Math.floor(Math.random() * 25)+65);  
            accessKey += String.fromCharCode(Math.floor(Math.random() * 25)+65);  
            accessKey += String.fromCharCode(Math.floor(Math.random() * 25)+65);  
            accessKey += String.fromCharCode(Math.floor(Math.random() * 25)+65);  
            accessKey += String.fromCharCode(Math.floor(Math.random() * 25)+65);  
            accessKey += String.fromCharCode(parseInt(pwd[i])+65);
        }
    
        accessKey += "==";
        return accessKey;
    }

    render(){
        return(
            <View style={styles.bodyPage}>
                <Text style={styles.HeadCenter}>
                    ToDoAct Signin
                </Text>
                <BlockColumn size={0.01} />
                {this.state.elementForm}
            </View>
        )
    }
}

export default Signin;


const styles = StyleSheet.create({
    bodyPage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginTop:'-50%'
    },
    HeadCenter:{
        fontSize:30,
        fontWeight:'bold'
    }
});