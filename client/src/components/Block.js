import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component{
    state = {displayTransaction:false};

    toggleTransaction = () =>{
        this.setState({displayTransaction: !this.state.displayTransaction});    
    }
    
    get displayTransaction(){
        const{data} =  this.props.block;
        const stringifiedData = JSON.stringify(data);
        const dataDisplay = stringifiedData.length > 20 ? `${stringifiedData.substring(0, 15)}...` : stringifiedData;
        if(this.state.displayTransaction){
        return(
            <div>{
                    data.map(transaction => (
                        <div key={transaction.id}>
                            <hr/>
                            <Transaction transaction={transaction}/>
                        </div>
                    ))
                
                } <br/>
                <Button bsStyle="danger" bsSize="small" onClick={this.toggleTransaction}>Show Less</Button>
            </div>
            );
        }
        return(<div><div> Share Data: {dataDisplay} <Button bsStyle="danger" bsSize="small" onClick={this.toggleTransaction}>Show More</Button></div></div>);
    }

    render(){
        console.log('this.displayTransaction', this.displayTransaction);
       const{timeStamp, hash} =  this.props.block;
        console.log('this.state', this.state);
        const hashDisplay = `${hash.substring(0, 15)}...`;
       
        return(
           
                    <div className="Block">
                        <div> Share Hash: {hashDisplay}</div>
                        <div> Share Timestamp: {new Date(timeStamp).toLocaleString()}</div>
                        
                        {this.displayTransaction}
                    </div>
        )
    }
}


export default Block;