import React, { Component } from 'react';
import Stock from '../../components/Stock/Stock'
import './StockList.css'

class StockList extends Component {
  constructor(props){ 
    super(props);
    this.state ={
      query:"",
      amount:"",
      stocks:[],
      id: props.id,
      userstocks:props.stocks
    } 
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    let self = this; 
    let stocksList = []; 
    fetch("http://localhost:3005/company").then((res2) => {
      return res2.json();
    }).then((json) => {
      json.forEach((element) => {
          stocksList.push(element);
      });
      self.setState({stocks: stocksList});
    })
  }

  handleChange(event) {
    let st = this.state; 
    st.query = event.target.value; 
    this.setState(st); 
  }

  handleBuy(companyid) {
    fetch("http://localhost:3005/buy",
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({traderID: this.state.id, companyID: companyid, numOfShares: this.state.amount}),
    }).then((result) => {
      return result.json();
    }).then((json) => {
      alert(json.message);
    })
  }

  handleInput(event) {
    let state = this.state;
    state.amount = event.target.value;
    this.setState(state);
  }

  handleAdd(event) {

  }
 
 
    render() {
      let stockr = this.state.stocks;
      return (
        <div className="tableDiv">
        <table>
          <thead>
          <tr>
            <th>CompanyID</th>
            <th>Price</th>
            <th>Shares</th>
            <input onChange={this.handleChange}></input>
          </tr>
          </thead>
          <tbody>
          {
              stockr.map((value,index) => {
                if (value.companyid.includes(this.state.query.toUpperCase())) {
                  let change = value.changepercent;
                  if (value.changepercent >= 0) {
                    change = "+" + value.changepercent;
                    return ( <Stock onType={(e) => this.handleInput(e)} onClick={(e)=> this.handleBuy(value.companyid)} key={index} cond={"green"} name={value.companyid} price={value.value} changePercent={change} shares={value.numofshares}/>)
                  } else {
                    return ( <Stock onClick={this.handleAdd} key={index} cond={"red"} name={value.companyid} price={value.value} changePercent={value.changepercent} shares={value.numofshares}/>)
                  }
                }
              })
          }
          </tbody>
        </table>
        </div>
      );
    }
  }
  export default StockList;