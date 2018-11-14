 import React, { Component } from 'react';
 import Stock from '../../components/Stock/Stock';
 class Portfolio extends Component{
     constructor(props){
         super(props);
         console.log(props);
         this.state = {
             stocks: props.stocks,
             query: "",
             name: props.name
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
      }).then(myt=>{
        console.log(myt);
        let st = this.state;
        fetch('http://localhost:3005/getTrader/'+st.name).then(res2 =>{
          console.log(res2);
          if(res2.status===500){
            console.log(res2); 
          }
          else
          {return res2.json();}
        }).then(myJ=>{
          console.log(myJ);
            st.id = myJ.trader.traderid;
            st.funds = myJ.trader.funds;
            st.watchlist = myJ.watchlist;
            let sum = 0; 
            console.log(st.Portfolio);
            myJ.portfolio.forEach(el =>{
              console.log(el);
              let r = parseInt(el.value,10)*parseInt(el.numofshares,10);
              sum = sum+ r; 
            })
            console.log(sum);
            st.worth = sum; 
      this.setState(st);
      this.componentDidMount(); 
        }) 
        
      })
      
      }
     render(){
         let self = this
         console.log(self.state);
         let stocksr = this.state.stocks; 
         return(
             <div>
                 <form onSubmit={this.submitDataBuy.bind(this)}> 
     <label>
       Buy: 
    <input  maxlength="4" size="4" onChange={(e)=>this.handleChangeBuy("comp",e)} value = {this.state.query}/>
      #Shares:
    <input  maxlength="4" size="4" onChange={(e)=>this.handleChangeBuy("price",e)} value={this.state.queryP}/>  
    <input type="submit" value="Submit"/>
    </label>            
    </form>
            {stocksr.map((value,index)=>{
                return(<li key={index}>
                <Stock name={value.companyid}/></li>)
            })}
     
             </div>
         )
     }
 }
 export  default Portfolio; 