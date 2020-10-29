import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

const Transaction = ({transaction}) => {
  const{input, outputMap} = transaction; 
  const recipient = Object.keys(outputMap);
  return (
            <div className='Transaction'>
                <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}</div>
                <div>
                    {
                        recipient.map(recipient => {
                         return(
                             <div key={recipient}>
                                 To: {`${recipient.substring(0, 12)}...`} | Sent: {outputMap[recipient]}
                             </div>
                         )   
                        })
                    }
                </div>
            </div>
        );
}


export default Transaction;