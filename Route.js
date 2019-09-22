import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Main from './page/Main.js'
import Signin from './page/Signin.js'

const Routes=()=>(
    <Router>
        <Scene key="root">
            <Scene key="main" component={Main} title="Main" initial={true} hideNavBar={true}/>
            <Scene key="signin" component={Signin} title="SignIn" initial={true} hideNavBar={true}/>
        </Scene>
    </Router>
)

export default Routes