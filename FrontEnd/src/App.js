import React, { Component } from 'react';
import './App.css';
import Leaderboard from './containers/LeaderBoard/LeaderBoard'
import User from './components/User/User'
import JasonContainer from './containers/JasonContainer/JasonContainer'
//"postgres://" + "rohan" + ":" + "jason" +  "@localhost:" + "5432" + "/304"
class App extends Component {
  constructor(props){
    super(props); 
    this.state={
      value: "",
      Portfolio:[],
      funds: null,
      worth: null,
      watchlist:[],
      query:"",
      queryP:"",
      id:null,
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
            st.id = myJ.trader.traderid;
            st.Portfolio=myJ.portfolio;
            st.funds = myJ.trader.funds;
            st.watchlist = myJ.watchlist;
            let sum = 0; 
            myJ.portfolio.forEach(el =>{
              console.log(el);
              let r = parseInt(el.value,10)*parseInt(el.shares,10);
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
      <header className="StockHead">
        StockWatch
      </header>
       {!this.state.id ?  <form><div class="box">

<label className="lab">Login ID:</label>
              <input class='email'type="name" value={this.state.value} onChange={this.handleChange.bind(this)} />
       <a href="#"><div onClick={this.submitData} class="btn">Sign In</div></a> 
<a href="#"><div onClick={this.signupData} id="btn2">Sign Up</div></a> </div></form>: 
[   <Leaderboard className="LeaderBoard"/>,
    <JasonContainer worth={this.state.worth} funds={this.state.funds}Portfolio={this.state.Portfolio} name={this.state.value} id={this.state.id} />
   ]}
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
