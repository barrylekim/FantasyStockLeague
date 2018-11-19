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
             <div className="test">
                 <table>
                     <thead>
                     <tr>
                         <th className="Primary">Company</th>
                         <th className="Primary">Price</th>
                         <th className="Primary">Shares Owned</th>
                         <th className="Primary">Total Value</th>
                     </tr>
                     </thead>
                     <tbody>
                     {stocksr.map((value, index) => {
                         return (<tr>
                             <td>{value.companyid}</td>
                             <td>{value.value}</td>
                             <td>{value.shares}</td>
                             <td>{(value.shares * value.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                         </tr>)
                     })}
                     </tbody>
                 </table>
             </div>
         )
     }
 }
 export  default Portfolio; 
