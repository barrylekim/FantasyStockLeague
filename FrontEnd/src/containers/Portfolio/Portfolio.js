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
               <thead className="TableH">
               <div className= "Primary" >Company</div>
               <div className= "Primary">Shares</div>
               <div className= "Primary">Total value</div>
               </thead>
            {stocksr.map((value,index)=>{
                return(<li key={index}>
                <Stock name={value.companyid} price={value.value} shares={value.shares}/></li>)
            })}
     
             </div>
         )
     }
 }
 export  default Portfolio; 