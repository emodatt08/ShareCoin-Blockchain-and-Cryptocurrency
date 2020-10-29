import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/img/logo.png';

class App extends Component{
    state = {walletInfo:{}};
    componentDidMount(){
        
        fetch('http://5.189.172.153:3000/api/wallet/info')
        .then(response=> response.json())
        .then(json => this.setState({walletInfo: json}))
    }
    render(){
      const {address, balance} = this.state.walletInfo;
    
      return(
    <div className="App">
        <img className='logo' src={logo}></img>
        <br/>
        <div><h3>Welcome to ShareCoin</h3></div>
        <br/>
        <div><Link to ='/blocks'>Shares</Link></div>
        <div><Link to ='/transact'>Buy Stock</Link></div>
        <div><Link to ='/pool'>Transacton Pool</Link></div>
        <div className="WalletInfo">         
            <div><b>Address:</b> {address}</div>
            <div><b>Balance:</b> {balance}</div>
        </div>
      
    </div>
        );
    }
}

export default App;
