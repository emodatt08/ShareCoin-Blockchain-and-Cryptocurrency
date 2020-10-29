import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Transaction from './Transaction';
import history from '../history';
import {FormGroup, FormControl, Button} from 'react-bootstrap';

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component{
    state = {transactionPoolMap: {}};
    fetchTransactionPoolMap = () =>{
       fetch(`http://5.189.172.153:3000/api/transact/pool`)
       .then(response => response.json()).then(json => this.setState({
        transactionPoolMap:json
    })); 
    }

    fetchMineTransactions = () =>{
        fetch(`http://5.189.172.153:3000/api/mine-transactions`)
        .then(response => {
           if(response.status === 200){
                alert('Mining Successfull');
                history.push('/blocks');
           }else{
               alert('Mining failed, please try again in a few minutes');
           }
     }); 
    }

    componentDidMount(){
        console.log(`${document.location.origin}/api/transact/pool`);
        this.fetchTransactionPoolMap();
        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        );
    }

    componentWillUnmount(){
        clearInterval(this.fetchPoolMapInterval);
    }

    render(){
        return(
            <div className="TransactionPool">
                <div><Link to='/'>Home</Link></div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction =>{
                        return (
                                <div key={transaction.id}>
                                    <hr/>
                                    <Transaction transaction={transaction} />
                                </div>
                               
                                  
                        )
                    })
                }
                <hr/>
                <Button bsStyle="danger" onClick={this.fetchMineTransactions}>Mine the Transactions</Button>
            </div>
        )
    }
}

export default TransactionPool;