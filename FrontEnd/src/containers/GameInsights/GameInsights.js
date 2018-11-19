import React, { Component } from 'react';
class GameInsights extends Component {
    constructor(props){
        super(props); 
        this.state =  {
            queryShare: "",
            queryFound: false,
            result: null
        }
        this.handleChange = this.handleChange.bind(this); 
        this.submitData = this.submitData.bind(this); 
    }
    handleChange(event){
        let st = this.state; 
        st.queryShare = event.target.value; 
        this.setState(st); 
    }
    submitData(event){
        event.preventDefault()
        let st = this.state
        let data = {companyid: st.queryShare}; 
        fetch('http://localhost:3005/largestShare',{
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers:{
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        }).then(res =>{
            return res.json();
        }).then(myt=>{
            st.queryFound = true;
            st.result = myt; 
            this.setState(st);  
            console.log(myt)
        })
    }
    render(){
        return (<div>
            <form onSubmit={this.submitData}>
        <input onChange={this.handleChange} value={this.state.queryShare}></input>
        <input type="submit" value="Submit"></input></form>
        {this.state.queryFound ? this.state.result : this.state.queryShare }
        </div>)
    }
}
export default GameInsights; 