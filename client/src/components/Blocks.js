import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Block from './Block';

class Blocks extends Component{
    state = {blocks: []}

    componentDidMount(){
        fetch(`http://5.189.172.153:3000/api/blocks`)
        .then(response=> response.json())
        .then(json => this.setState({blocks: json}))
    }

    render(){
        console.log('this.state', this.state);
        return(
            <div>
                <div><Link to ='/'>Home</Link></div>
                <h4>Shares(Blocks)</h4>
                <div>{
                this.state.blocks.map(block => {
                    return (
                    <div>
                        <Block key={block.hash} block={block}/>
                    </div>
                    )
                })
                
                }</div>
            </div>
        )
    }
}

export default Blocks;