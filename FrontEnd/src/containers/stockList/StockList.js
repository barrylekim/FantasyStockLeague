import React, { Component } from 'react';
import Stock from '../../components/Stock/Stock'
import './StockList.css'

class StockList extends Component {
  constructor(props){ 
    super(props);
    this.state ={
      query:"",
      queryP:"",
      stocks:[],
      id: props.id,
      userstocks:props.stocks
    } 

  }
  
    
  
  componentDidMount() {
    let self = this; 
    let stocksL = []; 
    fetch("http://localhost:3005/getCompany").then(res2=>{
      return res2.json();
    }).then(myJson2 =>{
      let promises = [];
      myJson2.forEach((element,index) => {
        stocksL[index] = element; 
        let url= "http://localhost:3005/getPrice/"+element.priceid;
        let promise = new Promise((resolve, reject) => {
          fetch(url).then(priceRes => {
            return priceRes.json();
          }).then(pJson =>{
            stocksL[index].price =pJson.value;
            console.log(stocksL[index]);
            resolve();
          });
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        console.log(stocksL[1]);
        console.log(stocksL[0]);
        self.setState({stocks:stocksL});
      })
    })
    
  }
 
 
    render() {
      let stockr = this.state.stocks; 
      return (
        <div className= "StockList" key='1'>
     
            {
              stockr.map((value,index) =>{
                return (<li key={index}>
                <Stock name= {value.companyid} shares= {value.numofShares} price= {value.price}/>
                </li>)
              })
            }
   
        </div>
      );
    }
  }
  export default StockList;