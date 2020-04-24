import React from 'react';
import './AddElement.modules.scss';
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import Dropdown from "../Dropdown/Dropdown";


const AddElement = (props) => {

	return (
		<div className="add-element card-animation">
			<p className="add-element__title">{props.title}</p>


			{props.dropdown ? <div className="add-element__dropdown-container">
					<Dropdown label={"Statuses"}
							  onChange={(event) => {
								  props.onChange(event)
							  }}
							  value={props["value"]}
							  array={props["statuses"]}/>
					<PrimaryButton label={`add ${props.title[0].toUpperCase()}${props.title.slice(1)} +`}
								   onClick={props.onClick}/>
				</div> :


				<PrimaryButton label={`add ${props.title[0].toUpperCase()}${props.title.slice(1)} +`}
							   onClick={props.onClick}/>}

		</div>
	);
};

export default AddElement;
