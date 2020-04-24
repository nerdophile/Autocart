import React from 'react';
import './Input.modules.scss';

const Input = ({placeholder, onChange, value, type, label, disabled}) => {
	return (
		<div>
			{label && <p className="label">{placeholder}</p>}
			<input
				disabled={disabled}
				className="Input"
				type={type}
				aria-label={placeholder}
				placeholder={placeholder}
				onChange={(event) => {
					onChange(event.target.value)
				}}
				value={value}
			/>
		</div>
	);
};

export default Input;
