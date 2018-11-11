 import React, { Component } from 'react';
 class Portfolio extends Component{
     constructor(props){
         super(props);
     }
     
    //        let self = this; 
    // let stocksL = []; 
    // fetch("http://localhost:3005/getCompany").then(res2=>{
    //   return res2.json();
    // }).then(myJson2 =>{
    //   let promises = [];
    //   myJson2.forEach((element,index) => {
    //     stocksL[index] = element; 
    //     let url= "http://localhost:3005/getPrice/"+element.priceid;
    //     let promise = new Promise((resolve, reject) => {
    //       fetch(url).then(priceRes => {
    //         return priceRes.json();
    //       }).then(pJson =>{
    //         stocksL[index].price =pJson.value;
    //         console.log(stocksL[index]);
    //         resolve();
    //       });
    //     });
    //     promises.push(promise);
    //   });
    //   Promise.all(promises).then(() => {
    //     console.log(stocksL[1]);
    //     console.log(stocksL[0]);
    //     self.setState({stocks:stocksL});
    //   })
    // })
    
     
     render(){
         return(
             <div>

             </div>
         )
     }
 }
 export  default Portfolio; 