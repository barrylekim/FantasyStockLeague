import React from 'react'; 
import './Stock.css'
const Stock = (props) =>{
    return (
        <div className="Stock">
            <p     text-align="left"
    margin-right= "auto">{props.name}</p> <p>{props.price}</p> <p  text-align="right"
    margin-left= "auto">{props.shares}</p>
        </div>
    )
}
export default Stock; 