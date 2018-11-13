import React, { Component } from 'react';
class Watchlist extends Component{
    constructor(props){
        super(props)
        this.state ={
            query:"",
            name: props.name
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitData = this.submitData.bind(this);
    }
    submitData(event){
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
    handleChange(event){
        let curr = this.state
        curr.query = event.target.value; 
        this.setState(curr); 
    }
    render(){
        return(
            <div className="WatchList">
                <form onSubmit={this.submitData.bind(this)}>
                <label>
                    Add To Watchlist:
                    <input onChange={this.handleChange} value = {this.state.query}/>
                    <input type="submit" value="Submit"/>
                </label>
                </form>                
            </div>
        )
    }
}
export default Watchlist; 