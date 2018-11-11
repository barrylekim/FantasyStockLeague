import React, { Component } from 'react';
import Member from '../../components/LeaderBoard/LeaderBoardMember'
class LeaderBoard extends Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        let self = this; 
    let people = []; 
    fetch("http://localhost:3005/getTraders").then(res2=>{
      return res2.json();
    }).then(myJson2 =>{
      myJson2.forEach((element,index) => {
        let person; 
        person.name = element.traderName;
        person.funds = element.funds;
        person.pvalue = element.pvalue;
        people.push(person);  
      });
    
    })
    }
    render(){
        return(
            <div>

            </div>
        )
    }
}