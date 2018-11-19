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
      name: props.name,
      userstocks:props.stocks,
      handler: props.handler,
      watchler: props.watchler
    } 
    this.handleInput = this.handleInput.bind(this);
    this.handleBuy = this.handleBuy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
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
    if (this.state.amount !== undefined) {
      var self = this;
      let global;
      fetch("http://localhost:3005/buy",
        {
          method: 'POST',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({ traderID: this.state.id, companyID: companyid, numOfShares: this.state.amount }),
        }).then((result) => {
          global = result.status;
          return result.json();
        }).then((json) => {
          if (global === 200) {
            let msg = {
              companyid: companyid,
              shares: self.state.amount,
              value: json.price
            }
            self.state.handler(msg);
          } else {
            if (global === 400) {
              alert("Not enough funds");
            } else {
              alert("Please enter amount");
            }
          }
        });
    }
  }

  handleInput(event) {
    let state = this.state;
    state.amount = event.target.value;
    this.setState(state);
  }

  handleAdd(value,event) {
    fetch("http://localhost:3005/addToWatchList",
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ name: this.state.name, CID: value.companyid }),
    }).then(() => {
      this.state.watchler(value);
    })
  }
 
 
    render() {
      let stockr = this.state.stocks;
      return (
        <div className="test">
          <table>
            <thead>
              <tr>
                <th>CompanyID</th>
                <th>Price</th>
                <th>Shares</th>
                <input className="search" onChange={this.handleChange}></input>
              </tr>
            </thead>
            <tbody>
              {
                stockr.map((value, index) => {
                  if (value.companyid.includes(this.state.query.toUpperCase())) {
                    let change = value.changepercent;
                    if (value.changepercent >= 0) {
                      change = "+" + value.changepercent;
                      return (<Stock onChange={this.handleInput} onAdd={(ez)=>this.handleAdd(value, ez)} onClick={(e) => this.handleBuy(value.companyid)} key={index} cond={"green"} name={value.companyid} price={value.value} changePercent={change} shares={value.numofshares} />)
                    } else {
                      return (<Stock onChange={this.handleInput} onAdd={(ez)=>this.handleAdd(value,ez)} onClick={(e) => this.handleBuy(value.companyid)} key={index} cond={"red"} name={value.companyid} price={value.value} changePercent={value.changepercent} shares={value.numofshares} />)
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