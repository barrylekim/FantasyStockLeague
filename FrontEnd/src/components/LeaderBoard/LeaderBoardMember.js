import React from 'react'; 
import './Member.css'
const Member = (props) =>{
    return (
        
            <p className="Member">{props.name} {props.funds}</p>
        
    )
}
export default Member; 