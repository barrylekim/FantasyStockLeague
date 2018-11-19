import React, { Component } from 'react';
import './LeaderBoard.css';
import Member from '../../components/LeaderBoard/LeaderBoardMember'
class LeaderBoard extends Component{
    constructor(props){
        super(props)
        this.state ={
            people:[]
        }
    }
    componentDidMount(){
        let self = this; 
        let curSt = self.state;
    let peoplez = []; 
    fetch("http://localhost:3005/getTopPlayersByValue").then(res2=>{
      return res2.json();
    }).then(myJson2 =>{
      myJson2.forEach((element,index) => {
        let person={}; 
        person.name = element.tradername;
        person.funds = element.funds;
        peoplez.push(person);  
      });
      curSt.people = peoplez;
      this.setState(curSt);
    })
    }
    render(){
        let peoples = this.state.people;
        return(
            <div className="LeaderBoard">
<header className="headerz">
        <h2 class="title"> Leaderboard</h2>
    </header>
    {
              peoples.map((value,index) =>{
                return (<li key={index}>
                <Member name= {value.name} funds= {value.funds} />
                </li>)
              })
            }
            </div>
        );
    }
}
export default LeaderBoard;
