import React, { Component } from 'react';
class WatchList extends Component{
    constructor(props){
        super(props)
        this.state ={
            query:"",
            name: props.name
        }
       
    }
    // submitDataWatchLIst(event){
    //     event.preventDefault(); 
    //     let st = this.state;
    //     let data = {
    //         name: st.name,
    //         CID: st.query
    //     }
    //     fetch('http://localhost:3005/addToWatchList',{
    //         method: 'POST',
    //         mode: 'cors',
    //         credentials: 'same-origin',
    //         headers:{
    //           "Content-Type": "application/json; charset=utf-8"
    //         },
    //         body: JSON.stringify(data),  
    //     }).then(res =>{
    //         console.log(res);
    //         return res.json();
    //     }).then(myJ=>{
    //         console.log(myJ);
    //     })

    // }
    // handleChangeWatchList(event){
    //     let curr = this.state
    //     curr.query = event.target.value; 
    //     this.setState(curr); 
    // }
    render(){
        return(
            <div className="WatchList">
                       
            </div>
        )
    }
}
export default WatchList; 