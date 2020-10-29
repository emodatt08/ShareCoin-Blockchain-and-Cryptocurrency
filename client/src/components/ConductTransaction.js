import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import history from '../history';
import {FormGroup, FormControl, Button} from 'react-bootstrap';

class ConductTransaction extends Component{
    state = {recipient: '', amount: 0};

    updateRecipient = event =>{
        this.setState({recipient: event.target.value});
    }

    updateAmount = event =>{
        this.setState({amount: Number(event.target.value)});
    }

    conductTransaction = () =>{
        const {recipient, amount, address} = this.state;
        fetch('http://5.189.172.153:3000/api/transact', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({recipient, amount,address})   
        }).then(response => response.json()).then(json =>{
            alert(json.message || json.type);
            history.push('/pool');
        });
    }


    render(){
        console.log('this.state', this.state);
        return(
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl
                    input='text'
                    placeholder='recipient'
                    value={this.state.recipient}
                    onChange={this.updateRecipient}
                    />
                </FormGroup>

                <FormGroup>
                    <FormControl
                    type='hidden'
                    value=""
                    value={this.state.address}
                    />
                </FormGroup>

                <FormGroup>
                    <FormControl
                    input='number'
                    placeholder='amount'
                    value={this.state.amount}
                    onChange={this.updateAmount}
                    />
                </FormGroup>
                <div><Button bsStyle="danger" onClick={this.conductTransaction} >Submit</Button></div>
            </div>
        )
    }
};


export default ConductTransaction;