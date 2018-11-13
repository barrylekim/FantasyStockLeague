import React, { Component } from 'react';
import Stock from '../../components/Stock/Stock'
import './StockList.css'
import Portfolio from '../Portfolio/Portfolio';

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
    this.handleChange = this.handleChange.bind(this); 
    this.submitData = this.submitData.bind(this); 

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
  handleChange(id,event) {
    let curr = this.state;
    if(id==="comp"){
      curr.query = event.target.value; 
      this.setState({curr});
    }
    else if(id==="price"){
      curr.queryP = event.target.value;
      this.setState({curr});
    }
    
  }
  submitData(event){
    event.preventDefault();
    let comp = this.state.query;
    let shares = this.state.queryP; 
    let id = this.state.id; 
    let data = {
      traderID: id,
      companyID: comp,
      numOfShares: shares
    }; 
    fetch('http://localhost:3005/buy',{
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers:{
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data),
  }).then(res =>{
    console.log(res);
    return res.json()
  }).then(myJ=>{
    console.log(myJ); 
  })

  }
    render() {
      let stockr = this.state.stocks; 
      return (
        <div className= "StockList" key='1'>
        <Portfolio></Portfolio>
     <form onSubmit={this.submitData.bind(this)}> 
     <label>
       Buy: 
    <input   onChange={(e)=>this.handleChange("comp",e)} value = {this.state.query}/>
    NumberOfShares:
    <input onChange={(e)=>this.handleChange("price",e)} value={this.state.queryP}/>  
    <input type="submit" value="Submit"/>
    </label>            
    </form>
            {
              stockr.map((value,index) =>{
                return (<li key={index}>
                <Stock name= {value.companyname} shares= {value.numofShares} price= {value.price}/>
                </li>)
              })
            }
   
        </div>
      );
    }
  }
  export default StockList;