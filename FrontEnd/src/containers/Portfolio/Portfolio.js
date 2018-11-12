 import React, { Component } from 'react';
 import Stock from '../../components/Stock/Stock';
 class Portfolio extends Component{
     constructor(props){
         super(props);
         console.log(props);
         this.state = {
             stocks: props.stocks
         }
     }
    
     
     render(){
         let self = this
         console.log(self.state);
         return(
             <div>
            
     
             </div>
         )
     }
 }
 export  default Portfolio; 