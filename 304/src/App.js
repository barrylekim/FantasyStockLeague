import React, { Component } from 'react';
import './App.css';
import User from './components/User/User'
import Portfolio from './containers/Portfolio/Portfolio'
import StockList from './containers/stockList/StockList'
//"postgres://" + "rohan" + ":" + "jason" +  "@localhost:" + "5432" + "/304"
class App extends Component {
  constructor(props){
    super(props); 
    this.state={
      value: " ",
      user: null
    }
    this.submitData = this.submitData.bind(this); // <-- add this line
    this.handleChange = this.handleChange.bind(this); 
  }
 

  handleChange(event) {
    
    let curr = this.state; 
    curr.value = event.target.value; 
    this.setState({curr});
  }
    // ...
 
submitData(event){
  event.preventDefault();
  let st = this.state
  this.setState(st);
  let promise = new Promise((resolve,reject)=>{
    fetch('http://localhost:3005/getTrader/'+st.value).then(res2 =>{
      return res2.json();
    }).then(myJ=>{
      if(myJ.status===200){
        st.user = myJ;
        console.log('acceptedID');
      }
      else{
        console.log("rejectedId");
        reject(); 
      }
    }) 
  })
}
  render() {

    return (
     
      <div className="App">
       {!this.state.user ?  <form><div class="box">
<h1>Dashboard</h1>
<label class="lab">Login ID:</label>
              <input class='email'type="email" value={this.state.value} onChange={this.handleChange.bind(this)} />
       <a href="#"><div class="btn">Sign In</div></a> 
<a href="#"><div id="btn2">Sign Up</div></a> </div></form>: [<User/>,<StockList></StockList>]}
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
