 import React, { Component } from 'react';
 import Stock from '../../components/Stock/Stock';
 class Portfolio extends Component{
     constructor(props){
         super(props);
         console.log(props);
         this.state = {
             stocks: props.stocks,
             query: "",
             name: props.name
         }
     }
   
     
     render(){
         let self = this
         console.log(self.state);
         let stocksr = this.state.stocks; 
         return(
             <div>
            {stocksr.map((value,index)=>{
                return(<li key={index}>
                <Stock name={value.companyid} price={value.value} shares={value.shares}/></li>)
            })}
     
             </div>
         )
     }
 }
 export  default Portfolio; 