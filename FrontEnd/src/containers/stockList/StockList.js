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

  handleBuy(event) {
    fetch("http://localhost:3005/buy",
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers:{
        "Content-Type": "application/json; charset=utf-8"
      }
      //body: JSON.stringify({name: data}),
    }).then((result) => {

    })
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
            <input onChange={this.handleChange} value={this.state.query}></input>
          </tr>
          </thead>
          <tbody>
          {
              stockr.map((value,index) => {
                if (value.companyid.includes(this.state.query.toUpperCase())) {
                  let change = value.changepercent;
                  if (value.changepercent >= 0) {
                    change = "+" + value.changepercent;
                    return ( <Stock onClick={this.handleBuy} key={index} cond={"green"} name={value.companyid} price={value.value} changePercent={change} shares={value.numofshares}/>)
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