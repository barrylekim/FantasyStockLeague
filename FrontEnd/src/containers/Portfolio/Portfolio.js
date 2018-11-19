 import React, { Component } from 'react';
 import Stock from '../../components/Stock/Stock';
 import './Portfolio.css'; 
 class Portfolio extends Component{
     constructor(props){
         super(props);
         console.log(props);
         this.state = {
             stocks: props.stocks,
             name: props.name
         }
     }
     componentWillReceiveProps(nextProps) {
      let curr = this.state; 
      curr.stocks=nextProps.stocks;
      this.setState({ curr});  
    }   
     render(){
         let self = this
         console.log(self.state);
         let stocksr = this.state.stocks; 
         return(
             <div>
               <table>
  <tr>
    <th className= "Primary">Company</th>
    <th className= "Primary">Total Value</th>
    <th className= "Primary">Shares</th>
  </tr>
               {stocksr.map((value,index)=>{
                return(<tr>
                  <td>{value.companyid}</td>
                  <td>{value.value}</td>
                  <td>{value.shares}</td>
                </tr>)
            })}
     </table>
             </div>
         )
     }
 }
 export  default Portfolio; 
