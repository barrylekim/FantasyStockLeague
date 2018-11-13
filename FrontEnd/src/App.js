import React, { Component } from 'react';
import './App.css';
import Leaderboard from './containers/LeaderBoard/LeaderBoard'
import User from './components/User/User'
import StockList from './containers/stockList/StockList'
//"postgres://" + "rohan" + ":" + "jason" +  "@localhost:" + "5432" + "/304"
class App extends Component {
  constructor(props){
    super(props); 
    this.state={
      value: "",
      user: null,
      Portfolio:[],
      funds: null,
      worth: null
    }
    this.submitData = this.submitData.bind(this); // <-- add this line
    this.handleChange = this.handleChange.bind(this); 
    this.signupData = this.signupData.bind(this);
  }
 

  handleChange(event) {
    
    let curr = this.state; 
    curr.value = event.target.value; 
    this.setState({curr});
  }
    // ...
 
submitData(event){
  event.preventDefault();
  let st = this.state;
    fetch('http://localhost:3005/getTrader/'+st.value).then(res2 =>{
      console.log(res2);
      if(res2.status===500){
        console.log(res2); 
      }
      else
      {return res2.json();}
    }).then(myJ=>{
      console.log(myJ);
        st.user = myJ.trader.traderid;
        st.Portfolio=myJ.portfolio;
        st.funds = myJ.trader.funds;
        let sum = 0; 
        st.Portfolio.forEach(el =>{
          console.log(el);
          let r = parseInt(el.value,10)*parseInt(el.numofshares,10);
          sum = sum+ r; 
        })
        console.log(sum);
        st.worth = sum; 
  this.setState(st);
        console.log('acceptedID');
    }) 
}
signupData(event){
  event.preventDefault()
  let st = this.state
  let data = st.value;
  fetch('http://localhost:3005/addTrader',{
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers:{
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({name: data}),
  }).then(res =>{
    console.log(res);
    return res.json()
  }).then(myJ=>{
    console.log(myJ); 
  })

}
  render() {

    return (
     
      <div className="App">
       {!this.state.user ?  <form><div class="box">
<h1>Dashboard</h1>
<label className="lab">Login ID:</label>
              <input class='email'type="name" value={this.state.value} onChange={this.handleChange.bind(this)} />
       <a href="#"><div onClick={this.submitData} class="btn">Sign In</div></a> 
<a href="#"><div onClick={this.signupData} id="btn2">Sign Up</div></a> </div></form>: [ <User worth={this.state.worth} cash= {this.state.funds}/>,<StockList id={this.state.user} portfolio={this.state.Portfolio}></StockList>,<Leaderboard/>]}
        <header className="App-header">
          <p>
            StockWatch
          </p>
          
        </header>
      </div>
    );
  }
}

export default App;
