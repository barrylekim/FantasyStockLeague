import React from 'react'; 
import './Stock.css'
const Stock = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.price}<p className={props.cond}>{props.changePercent}</p></td>
            <td>{props.shares}</td>
            <td>
                <button onClick={props.onClick}>BUY</button>
            </td>
            <td>
                <button>ADD</button>
            </td>
        </tr>
    )
}
export default Stock; 