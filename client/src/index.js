import React from 'react';
import {render} from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './assets/css/style2.css';
//import './assets/css/style.css'


render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks' component={Blocks}/>
            <Route path='/transact' component={ConductTransaction}/>
            <Route path='/pool' component={TransactionPool}/>

        </Switch>
    </Router>,
     document.getElementById('root')
     
     );