import React, { Component } from 'react';
class WatchList extends Component{
    constructor(props){
        super(props)
        this.state ={
            WatchList: props.list
        }
       
    }
 
    render(){
        return(
            <div className="WatchList">
                       
            </div>
        )
    }
}
export default WatchList; 