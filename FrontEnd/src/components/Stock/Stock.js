import React from 'react'; 
import './Stock.css'
const Stock = (props) =>{
    return (
        <div className="Stock">
            <p>{props.name} {props.price} {props.shares}</p>
        </div>
    )
}
export default Stock; 