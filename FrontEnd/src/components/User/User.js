import React, { Component } from 'react'
import './User.css'
const User = (props) =>{
return(<div className = "User">
    <h1 className= "Name">{props.name}</h1>
    <h3 className="UserHead">Net Worth: {props.worth}</h3>
    <h3 className="UserHead">Cash:$ {props.cash}</h3>
</div>)
}
export default User; 