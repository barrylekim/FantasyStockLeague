import React from 'react'; 
import './Stock.css'
const Stock = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.price}<span className={props.cond}>{props.changePercent}</span></td>
            <td>{props.shares}</td>
            <td>
                <input onChange={props.onChange} type="text" class="textBox"></input>
                <button onClick={props.onClick}>BUY</button>
            </td>
            <td>
                <button onClick={props.onAdd}>ADD</button>
            </td>
        </tr>
    )
}
export default Stock; 