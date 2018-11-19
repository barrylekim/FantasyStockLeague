import React, { Component } from 'react';
import Stock from '../../components/Stock/Stock'
import '../stockList/StockList.css'

class WatchList extends Component{
    constructor(props){
        super(props)
        this.state ={
            WatchList: props.list,
            handler: props.handler,
            query:""
        }
       this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let st = this.state; 
        st.query = event.target.value; 
        this.setState(st); 
      }
 
    render(){
        let stockr = this.state.WatchList; 
        console.log(stockr); 
        return(
            <div className="tableDiv">
        <table>
          <thead>
          <tr>
            <th>CompanyID</th>
            <th>Price</th>
            <th>Shares</th>
            <input className="search" onChange={this.handleChange} value={this.state.query}></input>
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
        )
    }
}
export default WatchList; 