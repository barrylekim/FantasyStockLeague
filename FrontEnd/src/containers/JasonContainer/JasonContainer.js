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
            currentView:"p",
            Portfolio:props.Portfolio,
            user:props.id,
            Watchlist: props.watchlist,
            name: props.name,
            worth:props.worth,
            funds:props.funds,
            query: "",
            queryP:""
        }
        this.handlechange = this.handlechange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this); 
        this.renderSwitch = this.renderSwitch.bind(this);
        this.submitDataBuy = this.submitDataBuy.bind(this);
        this.handleChangeBuy = this.handleChangeBuy.bind(this);
        this.submitDataWatchList = this.submitDataWatchList.bind(this); 
        this.handleChangeWatchList = this.handleChangeWatchList.bind(this); 
    }
    handlechange(id,event){
        event.preventDefault(); 
        let st = this.state; 
        if(st.currentView!=id){
            st.currentView=id; 
            this.setState(st);
        }
    }
    handle
    renderSwitch(param){
        switch (param){
            case("p"):
            return <Portfolio name={this.state.name} stocks = {this.state.Portfolio}/>
            break;
            case('w'):
            return <WatchList name= {this.state.name} list ={this.state.Watchlist}/>
            break;
            case("s"):
            return <Stocklist name={this.state.name} watchler={this.handleChangeWatchList} handler = {this.handlePortfolioChange} id={this.state.user} portfolio={this.state.Portfolio}/>
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
      handlePortfolioChange(msg){
          let st = this.state;
          let check = true;
          st.Portfolio.forEach((el)=>{
              if(el.companyid===msg.companyid){
                  check = false;
              }
          })
          if (check) {
            st.Portfolio.push(msg);
          } else {
            st.Portfolio.forEach((el)=>{
                if(el.companyid===msg.companyid){
                    let num = parseInt(el.shares);
                    num += parseInt(msg.shares);
                    el.shares = num.toString();
                }
            })
          }
          this.setState(st);
         
      }
     submitDataBuy(event){
        event.preventDefault();
        let self = this; 
        let comp = this.state.query;
        let shares = this.state.queryP; 
        let id = this.state.user; 
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
      submitDataWatchList(event) {
        event.preventDefault(); 
        let st = this.state;
        let data = {
            name: st.name,
            CID: st.query
        }
        fetch('http://localhost:3005/addToWatchList',{
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers:{
              "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data),  
        }).then(res =>{
            console.log(res);
            return res.json();
        }).then(myJ=>{
            console.log(myJ);
        })

    }
    handleChangeWatchList(par){
       let jasonWorksAtGoogle = this.state;
       console.log(par);
       jasonWorksAtGoogle.Watchlist.push(par);
       this.setState(jasonWorksAtGoogle);
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
     <User name={this.state.name}worth={this.state.worth} cash= {this.state.funds}/>
{this.renderSwitch(currS.currentView)}
</div>)

    }
}
export default JasonContainer; 