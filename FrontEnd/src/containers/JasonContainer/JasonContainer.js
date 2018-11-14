import React, { Component } from 'react';
import Portfolio from '../Portfolio/Portfolio';
import Stocklist from '../stockList/StockList';
import WatchList from '../WatchList/WatchList';
import User from '../../components/User/User'
import './JasonContainer.css'; 
class JasonContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentView:"",
            Portfolio:props.Portfolio,
            user:props.id,
            Watchlist: props.Watchlist,
            name: props.name,
            worth:props.worth,
            funds:props.funds,
            query: "",
            queryP:""
        }
        this.handlechange = this.handlechange.bind(this); 
        this.renderSwitch = this.renderSwitch.bind(this);
        this.submitDataBuy = this.submitDataBuy.bind(this);
        this.handleChangeBuy = this.handleChangeBuy.bind(this);  
    }
    handlechange(id,event){
        event.preventDefault(); 
        let st = this.state; 
        if(st.currentView!=id){
            st.currentView=id; 
            this.setState(st);
        }
    }
    renderSwitch(param){
        switch (param){
            case("p"):
            return <Portfolio name={this.state.name} stocks = {this.state.Portfolio}/>
            break;
            case('w'):
            return <WatchList name= {this.state.name}/>
            break;
            case("s"):
            return <Stocklist id={this.state.user} portfolio={this.state.Portfolio}/>
            break; 
            default: 
            return <Portfolio name={this.state.name} stocks = {this.state.Portfolio}/>
        }
    }
    handleChangeBuy(id,event) {
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
     submitDataBuy(event){
        event.preventDefault();
        var self = this; 
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
        return res.json()
      }).then(myt=>{
        let st = this.state;
        fetch('http://localhost:3005/getTrader/'+st.name).then(res2 =>{
          if(res2.status===500){
          }
          else
          {return res2.json();}
        }).then(myJ=>{
          console.log(myJ);
            st.id = myJ.trader.traderid;
            st.funds = myJ.trader.funds;
            st.watchlist = myJ.watchlist;
            st.Portfolio = myJ.portfolio
            let sum = 0; 
            
            myJ.portfolio.forEach(el =>{
              
              let r = parseInt(el.value,10)*parseInt(el.shares,10);
              sum = sum+ r; 
            })
            st.worth = sum; 
      self.setState(st);

        }) 
      })
      }
    render(){
        let currS = this.state; 
        return(
            <div className="Jason">
            <div class="btn-group" >
  <button onClick={(e)=>this.handlechange("p",e)}>Holdings</button>
  <button onClick={(e)=>this.handlechange("w",e)} >Watchlist</button>
  <button onClick={(e)=>this.handlechange("s",e)}>Stocklist</button>
</div>
<form onSubmit={this.submitDataBuy.bind(this)}> 
     <label>
       Buy: 
    <input  maxlength="4" size="4" onChange={(e)=>this.handleChangeBuy("comp",e)} value = {this.state.query}/>
      #Shares:
    <input  maxlength="4" size="4" onChange={(e)=>this.handleChangeBuy("price",e)} value={this.state.queryP}/>  
    <input type="submit" value="Submit"/>
    </label>            
    </form>
     <User name={this.state.name}worth={this.state.worth} cash= {this.state.funds}/>
{this.renderSwitch(currS.currentView)}
</div>)

    }
}
export default JasonContainer; 