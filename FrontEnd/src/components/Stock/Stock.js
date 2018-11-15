import React from 'react'; 
import './Stock.css'
const Stock = (props) =>{
    return (
        <div className="Stock">
            <p>{props.name}</p> <p>{props.price}</p> <p align="right">{props.shares}</p>
        </div>
    )
}
export default Stock; 