import React from 'react'; 
import './Stock.css'
const Stock = (props) =>{
    console.log(props);
    return (
        <div className="Stock">
            <p>{props.name} {props.price}</p>
        </div>
    )
}
export default Stock; 