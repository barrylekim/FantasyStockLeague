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
        person.funds = element.networth;
        person.returns = element.networth - 30000;
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
                <table>
                    <tr>
                        <th className="">Player</th>
                        <th>Networth</th>
                        <th>Total Returns</th>
                    </tr>
                    {peoples.map((value, index) => {
                        return (<tr>
                            <td>{value.name}</td>
                            <td>{value.funds}</td>
                            <td>{value.returns}</td>
                        </tr>)
                    })}
                </table>
            </div>
        );
    }
}
export default LeaderBoard;

