import React, {useState} from 'react';
import './Checkbox.modules.scss';

function Checkbox(props) {
	const [checked, setCheck] = useState(false);

	return (
		<div className="checkbox__container" onClick={() => {
			props.onClick();
			setCheck(!checked);
		}}>
			<div className={"checkbox  " + (checked ? "checkbox__checked" : "checkbox__unchecked")}/>
			<p className="checkbox__label">{props.label}</p>
		</div>
	);
}

export default Checkbox;
