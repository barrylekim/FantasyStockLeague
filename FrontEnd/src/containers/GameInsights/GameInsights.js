import React, { Component } from 'react';
class GameInsights extends Component {
    constructor(props){
        super(props); 
        this.state =  {
            queryShare: "",
            queryFound: false,
            result: null,
            showTransactions: false,
            transactions:[],
            mostTrans: "",
            highestTrans: ""
        }
        this.handleChange = this.handleChange.bind(this); 
        this.submitData = this.submitData.bind(this); 
        this.transB = this.transB.bind(this); 
        this.handleTransactions = this.handleTransactions.bind(this); 
    }
    handleChange(event){
        let st = this.state; 
        st.queryShare = event.target.value; 
        this.setState(st); 
    }
    componentDidMount(){
        let st = this.state; 
        fetch('http://localhost:3005/getMostTransactionPlayer').then(res=>{
            return res.json()
        }).then(myj=>{
            st.mostTrans = myj.message; 
        }).then(() => {
        //     fetch('http://localhost:3005/largestPriceTx').then(res2 =>{
        //         return res2.json();
        //     })
        // }).then(myj2=>{


        })
    }
    submitData(event){
        event.preventDefault()
        let st = this.state
        let data = {companyid: st.queryShare}; 
        fetch('http://localhost:3005/largestShare/'+st.queryShare).then(res =>{
            return res.json();
        }).then(myt=>{
            st.queryFound = true;
            st.result = myt.traderid; 
            this.setState(st);  
            console.log(myt)
        })
    }
    transB(){
        let st = this.state;
        if(st.showTransactions){
            st.showTransactions= false;
            st.transactions = [];
            this.setState(st); 
        }else{
            st.showTransactions=true; 
            fetch('http://localhost:3005/transaction').then(res =>{
                return res.json();
            }).then(myt=>{
                myt.forEach(element => {
                    let t = {}; 
                    t.id = element.transactionid;
                    t.traderid = element.traderid;
                    t.comp = element.companyid; 
                    t.shares = element.sharespurchased; 
                    st.transactions.push(t); 
                });
                this.setState(st); 
            })
        }
    }
    handleTransactions(param){
        console.log(
            param
        )
        
        let st = this.state; 
        if(param)
        {let val = (
            <table>
                <tr>
                    <th>Transaction Id</th>
                    <th>Trader Id</th>
                    <th>Company</th>
                    <th>Shares</th>
                </tr>
                <tbody>
                {st.transactions.map((el,index)=>{
                    return(
                        <tr>
                        <td>{el.id}</td>
                        <td>{el.traderid}</td>
                        <td>{el.comp}</td>
                        <td>{el.shares}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
        console.log(val); 
        return val; }else{
            return (null); 
        }

    }
    renderView(param){
        switch(param){
            case "v":
            return(
                [<form onSubmit={this.submitData}>
        <input onChange={this.handleChange} value={this.state.queryShare}></input>
        <input type="submit" value="Submit"></input></form>,
        this.state.result]
        
            )
        }
    }
    render(){
        return (<div>
            <select>
  <option value="volvo">SHOW ME COMPANIES IN ORDER OF STOCK VALUE</option>
  <option value="saab">SHOW ME THE PERSON WITH THE MOST SHARES OF COMPANY X</option>
  <option value="mercedes">SHOW ME ALL TRANSACTIONS</option>
  <option value="audi">Audi</option>
</select>
            <form onSubmit={this.submitData}>
        <input onChange={this.handleChange} value={this.state.queryShare}></input>
        <input type="submit" value="Submit"></input></form>
        {this.state.queryFound ? this.state.result : <div>Type here to find the person with the highest shares of company X</div>}
        <button onClick = {this.transB}>Click Here to See All Transactions</button>
        {this.handleTransactions(this.state.showTransactions)}
        <div>{this.state.mostTrans}</div>
        </div>)
    }
}
export default GameInsights; 